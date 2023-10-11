import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { createJWTAsync } from "../helpers/index.js";
import { ModelUser } from "../models/User.js";
import { handleResponse } from "./../middleware/index.js";
const login = async (req: Request, res: Response) => {
	try {
		const { username = "", password = "" } = matchedData(req);

		const query = ModelUser.findOne({ username });
		const user = await query.exec();

		//  Does not exist a user with that usernmae
		if (!user) {
			return handleResponse({
				res,
				statusCode: 404,
				msg: "Invalid username",
				error: new Error("Invalid credentials"),
			});
		}

		const isValidPassword = await user.isValidPassword(password);

		// Wrong password
		if (!isValidPassword) {
			return handleResponse({
				res,
				statusCode: 404,
				msg: "Invalid username",
				error: new Error("Invalid credentials"),
			});
		}

		const access_token = await createJWTAsync({
			uid: user._id.toString(),
			role: user.role,
		});

		return handleResponse({
			res,
			data: {
				access_token,
			},
			statusCode: 200,
		});
	} catch (error) {
		return handleResponse({
			res,
			error: new Error("Internal server error"),
			statusCode: 500,
			msg: "Error while trying to login",
		});
	}
};

export const AuthController = {
	login,
};
