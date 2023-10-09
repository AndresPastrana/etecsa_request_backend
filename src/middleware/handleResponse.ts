// No endpoint 403

import { Response } from "express";

interface HandleResponseParam {
	statusCode: number;
	msg?: string;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	data?: any | null | Object;
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	error?: any | null;
	res: Response;
}
export const handleResponse = (paylaod: HandleResponseParam) => {
	const { error, data, msg, statusCode, res } = paylaod;
	const response = {
		success: statusCode >= 200 && statusCode < 300,
		msg: msg || (statusCode >= 200 && statusCode < 300 ? "Success" : "Error"),
		data: data || null,
		error: error || null,
	};

	return res.status(statusCode).json(response);
};
