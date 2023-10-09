import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { handleResponse } from "../middleware/index.js";
import { ModelState } from "../models/index.js";

// Create a new State
//  const createState = async (req: Request, res: Response) => {
// 	try {
// 		// Extract and validate the data using matchedData
// 		const data = matchedData(req);

// 		// Create a new State document
// 		const newState = await ModelState.create(data);

// 		// Use the "handleResponse" function to handle the response
// 		handleResponse({
// 			statusCode: 201,
// 			msg: "State created successfully",
// 			data: newState,
// 			res,
// 		});
// 	} catch (error) {
// 		// Handle any errors that occur during creation
// 		handleResponse({
// 			statusCode: 500,
// 			msg: "Internal Server Error",
// 			error,
// 			res,
// 		});
// 	}
// };

// NOTE This endpoint is just for development propurses
// Insert multiple states belonging to the same province
export const insertStates = async (req: Request, res: Response) => {
	try {
		const { states, provinceId } = matchedData(req, {
			locations: ["body", "query"],
		});

		const uniqueStateNames = new Set(states as Array<string>);

		const uniqueStateNamesArray = Array.from(uniqueStateNames);

		const stateDocs = uniqueStateNamesArray.map((stateName) => ({
			name: stateName,
			province: provinceId,
		}));

		// TODO: Verify that any of this states is not in the database
		const repitedStates = ModelState.findOne({
			$and: [
				{ province: provinceId },
				{ name: { $in: uniqueStateNamesArray } },
			],
		});

		if (repitedStates) {
			return handleResponse({
				res,
				statusCode: 400,
				msg: "State already exists",
				error: repitedStates,
			});
		}

		const insertedStates = await ModelState.insertMany(stateDocs);

		handleResponse({
			statusCode: 201,
			msg: "States inserted successfully",
			data: insertedStates,
			res,
		});
	} catch (error) {
		// Handle any errors that occur during insertion
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Get all States
//  const getAllStates = async (req: Request, res: Response) => {
// 	try {
// 		const allStates = await ModelState.find({});

// 		handleResponse({
// 			statusCode: 200,
// 			msg: "All State documents retrieved successfully",
// 			data: allStates,
// 			res,
// 		});
// 	} catch (error) {
// 		handleResponse({
// 			statusCode: 500,
// 			msg: "Internal Server Error",
// 			error: error,
// 			res,
// 		});
// 	}
// };

// Get a State by ID
//  const getStateById = async (req: Request, res: Response) => {
// 	try {
// 		const { id } = matchedData(req, { locations: ["params"] });

// 		const state = await ModelState.findById(id);

// 		if (!state) {
// 			return handleResponse({
// 				statusCode: 404,
// 				msg: "State not found",
// 				res,
// 			});
// 		}

// 		handleResponse({
// 			statusCode: 200,
// 			msg: "State retrieved successfully",
// 			data: state,
// 			res,
// 		});
// 	} catch (error) {
// 		handleResponse({
// 			statusCode: 500,
// 			msg: "Internal Server Error",
// 			error,
// 			res,
// 		});
// 	}
// };

//  Get all States belonging to a specific Province
const getStatesByProvinceId = async (req: Request, res: Response) => {
	try {
		const { provinceId } = matchedData(req, { locations: ["query"] });

		const states = await ModelState.find({ province: provinceId });

		handleResponse({
			statusCode: 200,
			msg: "States retrieved successfully for the specified Province",
			data: states,
			res,
		});
	} catch (error) {
		// Handle any errors that occur during retrieval
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Update a State by ID
//  const updateStateById = async (req: Request, res: Response) => {
// 	try {
// 		const { name, id } = matchedData(req, { locations: ["params", "body"] });

// 		const updatedState = await ModelState.findByIdAndUpdate(
// 			id,
// 			{ name },
// 			{
// 				new: true,
// 			},
// 		);

// 		if (!updatedState) {
// 			return handleResponse({
// 				statusCode: 404,
// 				msg: "State not found",
// 				res,
// 			});
// 		}

// 		handleResponse({
// 			statusCode: 200,
// 			msg: "State updated successfully",
// 			data: updatedState,
// 			res,
// 		});
// 	} catch (error) {
// 		handleResponse({
// 			statusCode: 500,
// 			msg: "Internal Server Error",
// 			error,
// 			res,
// 		});
// 	}
// };

// Delete a State by ID
//  const deleteStateById = async (req: Request, res: Response) => {
// 	try {
// 		const { id } = matchedData(req, { locations: ["params"] });

// 		const deletedState = await ModelState.findByIdAndDelete(id);

// 		if (!deletedState) {
// 			return handleResponse({
// 				statusCode: 404,
// 				msg: "State not found",
// 				res,
// 			});
// 		}
// 		handleResponse({
// 			statusCode: 200,
// 			msg: "State deleted successfully",
// 			data: deletedState,
// 			res,
// 		});
// 	} catch (error) {
// 		// Handle any errors that occur during deletion
// 		handleResponse({
// 			statusCode: 500,
// 			msg: "Internal Server Error",
// 			error: error.message,
// 			res,
// 		});
// 	}
// };

export const StateController = {
	getStatesByProvinceId,
	insertStates,
};
