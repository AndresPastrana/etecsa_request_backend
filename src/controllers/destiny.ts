import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { handleResponse } from "../middleware/index.js";
import { ModelDestiny } from "../models/index.js";
// Create a new Destiny
const createDestiny = async (req: Request, res: Response) => {
	try {
		// Extract and validate the data using matchedData
		const { code, description, state } = matchedData(req);

		const repeatedDestiny = await ModelDestiny.findOne({
			$or: [{ code }, { description }],
		});

		if (repeatedDestiny) {
			return handleResponse({
				res,
				statusCode: 400,
				msg: "Theres alredy a destiny with this code or description",
			});
		}

		// Create a new Destiny document
		const newDestiny = await ModelDestiny.create({ code, description, state });

		// Use the "handleResponse" function to handle the response
		handleResponse({
			statusCode: 201,
			msg: "Destiny created successfully",
			data: newDestiny,
			res,
		});
	} catch (error) {
		// Handle any errors that occur during creation
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
		// Fetch all Destiny documents from the database
		const allDestinies = await ModelDestiny.find();

		// Use the "handleResponse" function to handle the response
		handleResponse({
			statusCode: 200,
			msg: "All Destiny documents retrieved successfully",
			data: allDestinies,
			res,
		});
	} catch (error) {
		// Handle any errors that occur during retrieval
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error: error.message,
			res,
		});
	}
};

// Get a Destiny by ID
const getDestinyById = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });

		// Find a Destiny document by ID
		const destiny = await ModelDestiny.findById(id);

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
		// Extract and validate the data using matchedData
		const { code, description, id } = matchedData(req);

		const destinyWithSameCode = await ModelDestiny.findOne({
			$and: [{ code }, { _id: { $ne: id } }],
		});

		if (destinyWithSameCode) {
			return handleResponse({
				res,
				statusCode: 400,
				msg: "Invalid code or description",
				error: "code must be unique",
			});
		}

		// Find and update a Destiny document by ID
		const updatedDestiny = await ModelDestiny.findByIdAndUpdate(
			id,
			{ code, description },
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

		handleResponse({
			statusCode: 200,
			msg: "Destiny updated successfully",
			data: updatedDestiny,
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

		if (!deletedDestiny) {
			return handleResponse({
				statusCode: 404,
				msg: "Destiny not found",
				res,
			});
		}

		// Use the "handleResponse" function to handle the response
		handleResponse({
			statusCode: 200,
			msg: "Destiny deleted successfully",
			data: deletedDestiny,
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