import { Request, Response } from "express";
import { handleResponse } from "../middleware/index.js";
import { ModelProvince } from "../models/index.js";

// Create a new Province
const createProvince = async (req: Request, res: Response) => {
	try {
		const { name } = req.body;
		const province = new ModelProvince({ name });
		await province.save();
		const responseData = { id: province._id, name: province.name };
		handleResponse({
			statusCode: 201,
			msg: "Province created successfully",
			data: responseData,
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

// Get all Provinces
const getAllProvinces = async (req: Request, res: Response) => {
	try {
		const provinces = await ModelProvince.find();
		handleResponse({
			statusCode: 200,
			msg: "Provinces retrieved successfully",
			data: provinces,
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

// Get a single Province by ID
const getProvinceById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const province = await ModelProvince.findById(id);
		if (!province) {
			handleResponse({ statusCode: 404, msg: "Province not found", res });
		} else {
			handleResponse({
				statusCode: 200,
				msg: "Province retrieved successfully",
				data: province,
				res,
			});
		}
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Update a Province by ID
const updateProvinceById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const updatedProvince = await ModelProvince.findByIdAndUpdate(
			id,
			req.body,
			{ new: true },
		);
		if (!updatedProvince) {
			handleResponse({ statusCode: 404, msg: "Province not found", res });
		} else {
			handleResponse({
				statusCode: 200,
				msg: "Province updated successfully",
				data: updatedProvince,
				res,
			});
		}
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Delete a Province by ID
const deleteProvinceById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const deletedProvince = await ModelProvince.findByIdAndDelete(id);
		if (!deletedProvince) {
			handleResponse({ statusCode: 404, msg: "Province not found", res });
		} else {
			handleResponse({
				statusCode: 200,
				msg: "Province deleted successfully",
				data: deletedProvince,
				res,
			});
		}
	} catch (error) {
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};
export const ProvinceController = {
	createProvince,
	updateProvinceById,
	deleteProvinceById,
	getAllProvinces,
	getProvinceById,
};
