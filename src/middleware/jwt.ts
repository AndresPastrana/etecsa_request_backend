import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Payload } from "../types.js";
import { UserRole } from "./../const.js";
import { handleResponse } from "./handleResponse.js";

export const isValidToken = (
	req: Request & {
		user?: {
			role: UserRole;
			uid: Types.ObjectId | string;
		};
	},
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
		const token = jwt.verify(toVerify, key, { complete: true });
		if (token.payload) {
			const payload: Payload = token.payload as Payload;
			// The uid is appended to the req.user as an ObjectId
			const user = { ...payload, uid: new Types.ObjectId(payload.uid) };
			req.user = user;
			return next();
		}
		return handleResponse({
			res,
			msg: "Invalid jwt",
			error: "Invalid jwt",
			statusCode: 401,
		});
	} catch (error) {
		return handleResponse({ res, error, msg: "Invalid jwt", statusCode: 401 });
	}
};
