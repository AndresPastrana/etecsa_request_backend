import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { handleResponse } from "./../middleware/index.js";
import { ModelCCosto, ModelDepartament } from "./../models/index.js";

// Create a new Departament
const createDepartament = async (req: Request, res: Response) => {
	try {
		// Extract and validate the data using matchedData
		const data = matchedData(req);
		const existcCosto = await ModelCCosto.findById(data.ccosto);

		if (!existcCosto) {
			return handleResponse({
				res,
				statusCode: 404,
				error: true,
				msg: "cccosto not found",
			});
		}

		// Check for a departamanet with the same ccosto
		const existDpto = await ModelDepartament.findOne({
			$or: [{ ccosto: existcCosto._id }, { descripcion: data.descripcion }],
		});

		if (existDpto) {
			return handleResponse({
				res,
				statusCode: 404,
				error: `Alredy exist a departamnet with the same ccosto or descripcion. ccosto:${data.ccosto} descripcion:${data.descripcion}`,
			});
		}

		const newDepartament = await ModelDepartament.create(data);

		handleResponse({
			statusCode: 201,
			msg: "Departament created successfully",
			data: newDepartament,
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

// Update a Departament by ID
const updateDepartamentById = async (req: Request, res: Response) => {
	try {
		const { id, ...rest } = matchedData(req, { locations: ["body", "params"] });

		const existcCosto = await ModelCCosto.findById(rest.ccosto);

		if (!existcCosto) {
			return handleResponse({
				res,
				statusCode: 404,
				error: true,
				msg: "cccosto not found",
			});
		}

		// Check for a departament with the same ccost and descrition que no sea el mismo
		const existDpto = await ModelDepartament.findOne({
			$and: [
				{ $or: [{ ccosto: rest.ccost }, { descripcion: rest.descripcion }] },
				{ _id: { $ne: id } },
			],
		});

		if (existDpto) {
			return handleResponse({
				res,
				statusCode: 404,
				error: `Alredy exist a departamnet with the same ccosto or descripcion. ccosto:${data.ccosto} descripcion:${data.descripcion}`,
			});
		}

		const updatedDepartament = await ModelDepartament.findByIdAndUpdate(
			id,
			{ ...rest },
			{ new: true },
		);

		if (!updatedDepartament) {
			return handleResponse({
				statusCode: 404,
				msg: "Departament not found",
				res,
			});
		}
		handleResponse({
			statusCode: 201,
			msg: "Departament updated successfully",
			data: updatedDepartament,
			res,
		});
	} catch (error) {
		// Handle any errors that occur during update
		handleResponse({
			statusCode: 500,
			msg: "Internal Server Error",
			error,
			res,
		});
	}
};

// Get all Departament
const getAllDepartaments = async (req: Request, res: Response) => {
	try {
		const allDepartaments = await ModelDepartament.find({}).populate("ccosto");

		handleResponse({
			statusCode: 200,
			msg: "All Departament documents retrieved successfully",
			data: allDepartaments,
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

// GET departments by id
const getDepartamentById = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });

		//    TODO: Only the of departament can get the info of his Departament

		// Find a Departament document by ID and populate the "ccosto" field
		const departament = await ModelDepartament.findById(id).populate("ccosto");

		if (!departament) {
			return handleResponse({
				statusCode: 404,
				msg: "Departament not found",
				res,
			});
		}

		handleResponse({
			statusCode: 200,
			msg: "Departament retrieved successfully",
			data: departament,
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

// Delete a Departament by ID
const deleteDepartamentById = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });

		// Find and delete a Departament document by ID
		const deletedDepartament = await ModelDepartament.findByIdAndDelete(id);

		if (!deletedDepartament) {
			return handleResponse({
				statusCode: 404,
				msg: "Departament not found",
				res,
			});
		}

		// Use the "handleResponse" function to handle the response
		handleResponse({
			statusCode: 200,
			msg: "Departament deleted successfully",
			data: deletedDepartament,
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

export const DepartamentController = {
	getDepartamentById,
	getAllDepartaments,
	createDepartament,
	updateDepartamentById,
	deleteDepartamentById,
};
