import { ModelProduct } from "./../models/index.js";
// Get products list
import { matchedData } from "express-validator";

import { Request, Response } from "express";
import { handleResponse } from "../middleware/index.js";

// Create a new product
const createProduct = async (req: Request, res: Response) => {
	try {
		const { code, name, price, aviableQuantity } = matchedData(req);

		// Check if a product with the same code or name already exists
		const existingProduct = await ModelProduct.findOne({
			$or: [{ code }, { name }],
		});

		if (existingProduct) {
			return handleResponse({
				statusCode: 400,
				msg: `A product with this code or name already exists. code:${code} name:${name}`,
				res,
			});
		}

		const product = new ModelProduct({
			code,
			name,
			price,
			aviableQuantity,
		});

		await product.save();

		handleResponse({
			statusCode: 201,
			msg: "Product created successfully",
			data: product,
			res,
		});
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Get all products
const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await ModelProduct.find({});
		handleResponse({
			statusCode: 200,
			msg: "Products retrieved successfully",
			data: products,
			res,
		});
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Get a product by ID
const getProductById = async (req: Request, res: Response) => {
	try {
		// We assume that the id alredy is an ObjectID
		const { id } = matchedData(req, { locations: ["params"] });
		const product = await ModelProduct.findById(id);

		if (!product) {
			return handleResponse({ statusCode: 404, msg: "Product not found", res });
		}

		handleResponse({
			statusCode: 200,
			msg: "Product retrieved successfully",
			data: product,
			res,
		});
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Update a product by ID
const updateProductById = async (req: Request, res: Response) => {
	try {
		const { code, name, price, aviableQuantity, id } = matchedData(req, {
			locations: ["body", "params"],
		});

		const existingProduct = await ModelProduct.findOne({
			$and: [
				{ _id: { $ne: id } }, // Exclude the current product being updated
				{ $or: [{ code }, { name }] },
			],
		});

		if (existingProduct) {
			return handleResponse({
				statusCode: 400,
				msg: `A product with this code or name already exists. code: ${code}, name: ${name}`,
				res,
			});
		}

		const product = await ModelProduct.findByIdAndUpdate(
			req.params.id,
			{
				code,
				name,
				price,
				aviableQuantity,
			},
			{ new: true },
		);

		if (!product) {
			return handleResponse({ statusCode: 404, msg: "Product not found", res });
		}

		handleResponse({
			statusCode: 200,
			msg: "Product updated successfully",
			data: product,
			res,
		});
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Delete a product by ID
const deleteProductById = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });
		const product = await ModelProduct.findByIdAndRemove(id);

		if (!product) {
			return handleResponse({ statusCode: 404, msg: "Product not found", res });
		}

		handleResponse({
			statusCode: 200,
			msg: "Product deleted successfully",
			data:product,
			res,
		});
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

export const ProductController = {
	createProduct,
	getAllProducts,
	getProductById,
	updateProductById,
	deleteProductById,
};
