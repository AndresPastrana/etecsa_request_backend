import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "./../controllers/index.js";
import { validateRequest } from "./../middleware/index.js";
export const router = Router();

const loginvalidationMiddleware = [
	body("username")
		.exists()
		.withMessage("Username is required")
		.isString()
		.withMessage("Username must be a string")
		.trim()
		.escape(),
	body("password")
		.exists()
		.withMessage("Passwordname is required")
		.isString()
		.withMessage("Password must be a string")
		.trim()
		.escape(),
	validateRequest,
];
router.post("/login", loginvalidationMiddleware, AuthController.login);
