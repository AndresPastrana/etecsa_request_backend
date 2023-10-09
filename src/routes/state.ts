import { Router } from "express";
import { body, query } from "express-validator";
import { Types } from "mongoose";
import { StateController } from "../controllers/index.js";
import { validateRequest } from "../middleware/index.js";
export const router = Router();

// Validation and sanitization middleware for insertStates
const insertStatesValidationMiddleware = [
	body("states")
		.isArray({ min: 1 })
		.withMessage(
			"States array is required and must contain at least one state name",
		),
	body("states.*.name")
		.isString()
		.trim()
		.notEmpty()
		.withMessage("State name is required and must be a non-empty string"),
	validateRequest,
];

// Validation middleware for getStatesByProvinceId
const queryProvinceIdValidationMiddleware = [
	query("provinceId")
		.isMongoId()
		.withMessage("Invalid Province ID")
		.customSanitizer((value) => new Types.ObjectId(value)),
];

// JUST for development purposes
router.post(
	"/",
	[...queryProvinceIdValidationMiddleware, ...insertStatesValidationMiddleware],
	StateController.insertStates,
);

router.get(
	"/",
	queryProvinceIdValidationMiddleware,
	StateController.getStatesByProvinceId,
);
