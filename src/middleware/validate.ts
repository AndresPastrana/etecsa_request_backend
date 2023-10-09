import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { handleResponse } from "../middleware/index.js";
export const validateRequest = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const errors = validationResult(req).array();

	return errors.length > 0
		? handleResponse({ error: errors, res, statusCode: 400 })
		: next();
};
