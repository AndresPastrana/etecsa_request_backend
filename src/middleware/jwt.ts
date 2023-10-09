import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { handleResponse } from "./handleResponse.js";

export const isValidToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization = null } = req.headers;

	if (!authorization || !authorization.includes("Bearer")) {
		return handleResponse({
			res,
			statusCode: 401,
			error: true,
			msg: "Authorization header missed or inavlid",
		});
	}

	// Verify token
	const toVerify = authorization.split("Bearer ")[1];
	const key = process.env.SECRET_KEY || "";
	try {
		const token = jwt.verify(toVerify, key);
		if (token) {
			req.user = token;
			return next();
		}
	} catch (error) {
		return handleResponse({ res, error, msg: "Invalid jwt", statusCode: 401 });
	}

	return handleResponse({
		res,
		statusCode: 401,
		error: true,
		msg: "Bearer token is required",
	});
};
