import jwt from "jsonwebtoken/index.js";
import { Payload } from "../types.js";
const { sign } = jwt;

// Function to create and sign a JWT
export function createJWTAsync(payload: Payload) {
	return new Promise((resolve, reject) => {
		const options = {
			expiresIn: "24h", // Token expiration time (you can adjust this as needed)
		};
		const SECRET_KEY = process.env.SECRET_KEY || "";
		// Create and sign the token
		sign(payload, SECRET_KEY, options, (error, token) => {
			if (error) {
				return reject(error);
			}
			return resolve(token);
		});
	});
}
