import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { handleResponse } from "../middleware/index.js";
import { ModelDestiny } from "../models/index.js";
// Create a new Destiny
const createDestiny = async (req: Request, res: Response) => {
	try {
		const { code, description, state } = matchedData(req);
		const repeatedDestiny = await ModelDestiny.findOne({
			$or: [{ code }, { description }],
		});

		if (repeatedDestiny) {
			return handleResponse({
				res,
				statusCode: 400,
				msg: `Theres alredy a destiny with this code or description code: ${code} description: ${description}`,
			});
		}
		const newDestiny = await ModelDestiny.create({ code, description, state });


		const populated = await newDestiny.populate('state')
		handleResponse({
			statusCode: 201,
			msg: "Destiny created successfully",
			data: populated,
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

// Get all Destinies
const getAllDestinies = async (req: Request, res: Response) => {
	try {
		const allDestinies = await ModelDestiny.find({}).populate('state');

		handleResponse({
			statusCode: 200,
			msg: "All Destiny documents retrieved successfully",
			data: allDestinies,
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

// Get a Destiny by ID
const getDestinyById = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });

		// Find a Destiny document by ID
		const destiny = await ModelDestiny.findById(id).populate('state');

		if (!destiny) {
			return handleResponse({
				statusCode: 404,
				msg: "Destiny not found",
				res,
			});
		}

		handleResponse({
			statusCode: 200,
			msg: "Destiny retrieved successfully",
			data: destiny,
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

// Update a Destiny by ID
const updateDestinyById = async (req: Request, res: Response) => {
	try {
		const { code, description, state, id } = matchedData(req, {
			locations: ["body", "params"],
		});

		const destinyWithSameCode = await ModelDestiny.findOne({
			$and: [{ $or: [{ code }, { description }] }, { _id: { $ne: id } }],
		});

		if (destinyWithSameCode) {
			return handleResponse({
				res,
				statusCode: 400,
				msg: "Invalid code or description",
				error: "code must be unique",
			});
		}

		const updatedDestiny = await ModelDestiny.findByIdAndUpdate(
			id,
			{ code, description,state },
			{
				new: true,
			},
		);

		if (!updatedDestiny) {
			return handleResponse({
				statusCode: 404,
				msg: "Destiny not found",
				res,
			});
		}
        const populated = await updatedDestiny.populate('state')
		handleResponse({
			statusCode: 200,
			msg: "Destiny updated successfully",
			data: populated,
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

// Delete a Destiny by ID
const deleteDestinyById = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });

		// Find and delete a Destiny document by ID
		const deletedDestiny = await ModelDestiny.findByIdAndDelete(id);

		// Thid code is not necesary, we made this validation in the paramIdValidationMiddleware in the router
		if (!deletedDestiny) {
			return handleResponse({
				statusCode: 404,
				msg: "Destiny not found",
				res,
			});
		}
         const populted = await deletedDestiny.populate('state')
		// Use the "handleResponse" function to handle the response
		handleResponse({
			statusCode: 200,
			msg: "Destiny deleted successfully",
			data: populted,
			res,
		});
	} catch (error) {
		// Handle any errors that occur during deletion
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

export const DestinyController = {
	createDestiny,
	updateDestinyById,
	getAllDestinies,
	getDestinyById,
	deleteDestinyById,
};
