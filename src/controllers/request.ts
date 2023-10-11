import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Schema } from "mongoose";
import { RequestStatus } from "../const.js";
import { calculateTotalImport } from "../helpers/index.js";
import { PiplineEntry, RequestCounter } from "../types.js";
import { UserRole } from "./../const.js";
import { handleResponse } from "./../middleware/index.js";
import { ModelIBilling, ModelRequest, ModelUser } from "./../models/index.js";
// Create a new request
const createRequest = async (
	req: Request & {
		user?: {
			role: UserRole;
			uid: Schema.Types.ObjectId;
		};
	},
	res: Response,
) => {
	try {
		const authUser = await ModelUser.findById(req.user?.uid);
		if (!authUser?.departament) {
			return handleResponse({
				res,
				statusCode: 401,
				msg: "Unauthorized",
			});
		}

		const {
			status = RequestStatus.PENDING,
			approvedBy = null,
			departament = null,
			resources,
			destiny,
		} = matchedData(req);
		const newRequest = new ModelRequest({
			departament: authUser.departament,
			resources,
			destiny,
		});

		const result = await newRequest.save();
		const newR = await result.populate("departament");

		handleResponse({
			statusCode: 201,
			msg: "Request created successfully",
			data: newR,
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

// Edit the request
const aproveRequest = async (
	req: Request & {
		user?: {
			role: UserRole;
			uid: Schema.Types.ObjectId;
		};
	},
	res: Response,
) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });
		const requestToAprove = await ModelRequest.findById(id);
		if (requestToAprove && requestToAprove?.resources.length >= 1) {
			const productsWithQuantity = requestToAprove?.resources.map((r) => ({
				productId: r.product,
				quantity: r.quantity,
			}));

			// Calculate total import
			const totalImport = await calculateTotalImport(productsWithQuantity);

			// Crate a new bill
			const requestBill = new ModelIBilling({
				request: id,
				total_import: totalImport,
			});

			requestToAprove.status = RequestStatus.APPROVED;
			requestToAprove.aprovedBy = req.user?.uid;

			const results = await Promise.all([
				requestToAprove.save(),
				requestBill.save(),
			]);
			const populated = await results[0].populate([
				"aprovedBy",
				"departament",
				"destiny",
			]);

			return handleResponse({
				res,
				data: { request: populated, bill: results[1] },
				statusCode: 200,
			});
		}

		return handleResponse({
			res,
			data: id,
			statusCode: 200,
		});
	} catch (error) {}
};

const deniedRequest = async (
	req: Request & {
		user?: {
			role: UserRole;
			uid: Schema.Types.ObjectId;
		};
	},
	res: Response,
) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });

		const requestToAprove = await ModelRequest.findById(id);
		if (requestToAprove) {
			requestToAprove.status = RequestStatus.DENIED;
			requestToAprove.aprovedBy = req.user?.uid;
			const updatedRequest = await requestToAprove.save();

			const populated = await updatedRequest.populate([
				"aprovedBy",
				"departament",
				"destiny",
			]);
			return handleResponse({
				res,
				data: populated,
				statusCode: 201,
			});
		}
	} catch (error) {
		return handleResponse({
			res,
			error,
			statusCode: 500,
			msg: "Internla server error",
		});
	}
};

const getRequestCountsByStatus = async (req: Request, res: Response) => {
	const pipeline = [
		{
			$match: {
				status: { $in: Object.values(RequestStatus) },
			},
		},
		{
			$group: {
				_id: "$status",
				count: { $sum: 1 },
			},
		},
	];
	try {
		// Execute the aggregation pipeline
		const result: Array<PiplineEntry> = await ModelRequest.aggregate(pipeline);

		// Create an object to store the counts
		const counts: RequestCounter = {
			approved: 0,
			denied: 0,
			pending: 0,
		};

		// Update the counts based on the aggregation result
		result.forEach(({ _id, count }: PiplineEntry) => {
			counts[_id] = count;
		});

		handleResponse({
			statusCode: 200,
			msg: "Request counts retrieved successfully",
			data: counts,
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

const getAllRequest = async (
	req: Request & {
		user?: {
			role: UserRole;
			uid: Schema.Types.ObjectId;
		};
	},
	res: Response,
) => {
	try {
		// Get the user role and the departament of the user if it has one
		const { status, departament = null } = matchedData(req, {
			locations: ["query"],
		});

		const autUser = await ModelUser.findById(req.user?.uid);
		const isHeadOfDepartment = autUser?.role === UserRole.HEAD_OF_DEPARTMENT;
		// console.log("Auth user");
		// console.log(autUser);
		// console.log(isHeadOfDepartment);
		const statusFilter = status === "all" ? {} : { status };
		const departamentFilter = departament ? { departament } : {};

		let query;

		if (
			isHeadOfDepartment &&
			!(autUser.departament?.toString() === departament.toString())
		) {
			return handleResponse({
				res,
				statusCode: 401,
				error: "Unauthorized",
				msg: "You cant perform this action",
			});
		}

		if (!isHeadOfDepartment) {
			query = ModelRequest.find({ ...statusFilter, ...departamentFilter });
		}

		if (
			isHeadOfDepartment &&
			autUser.departament?.toString() === departament.toString()
		) {
			query = ModelRequest.find({ ...statusFilter, ...departamentFilter });
		}

		const results = await query?.exec();

		return handleResponse({ data: results, statusCode: 200, res });
	} catch (error) {
		return handleResponse({
			res,
			error,
			statusCode: 500,
			msg: "Internla server error",
		});
	}
};

const generatePdf = async (req: Request, res: Response) => {
	try {
		const { id } = matchedData(req, { locations: ["params"] });
		const request = await ModelRequest.findById(id).populate([
			"departament",
			"destiny",
		]);

		if (request) {
			console.log("Hereee");

			return handleResponse({
				res,
				data: request,
				statusCode: 200,
			});
		}

		return handleResponse({
			res,
			error: "Request not found",
			statusCode: 404,
		});
	} catch (error) {
		return handleResponse({
			res,
			statusCode: 500,
			msg: "Internal Server error",
		});
	}
};

export const RequetsController = {
	getRequestCountsByStatus,
	createRequest,
	getAllRequest,
	generatePdf,
	aproveRequest,
	deniedRequest,
};
