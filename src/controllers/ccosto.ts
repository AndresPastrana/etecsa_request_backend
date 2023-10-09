import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { handleResponse } from "../middleware/index.js";
import { ModelCCosto } from "../models/index.js";

// NOTE: This endpoint is just for development purposes
// Insert multiple CCosto documents
const insertManyCCostos = async (req: Request, res: Response) => {
	try {
		// Extract and validate the data using matchedData
		const { cCostosToInsert } = matchedData(req, { locations: ["body"] });

		// Validate each document to ensure the "code" field is unique
		const uniqueCodes = new Set<string>();
		for (const cCosto of cCostosToInsert) {
			if (!uniqueCodes.has(cCosto.code)) {
				uniqueCodes.add(cCosto.code);
			} else {
				// Duplicate "code" found, return an error response
				return handleResponse({
					statusCode: 400,
					msg: `Duplicate code: ${cCosto.code}`,
					res,
				});
			}
		}

		const insertedCCostos = await ModelCCosto.insertMany(cCostosToInsert);

		handleResponse({
			statusCode: 201,
			msg: "Documents inserted successfully",
			data: insertedCCostos,
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

// Get all CCosto documents
const getAllCCostos = async (req: Request, res: Response) => {
	try {
		// Fetch all CCosto documents from the database
		const allCCostos = await ModelCCosto.find();

		handleResponse({
			statusCode: 200,
			msg: "All CCosto documents retrieved successfully",
			data: allCCostos,
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

export const CCostoController = {
	insertManyCCostos,
	getAllCCostos,
};
