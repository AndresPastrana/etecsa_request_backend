import { Router } from "express";
import { body, param } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { UserRole } from "./../const.js";
import { DestinyController } from "./../controllers/index.js";
import {
	isValidDoc,
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
import { ModelDestiny, ModelState } from "./../models/index.js";

export const router = Router();

const authValidation = [
	isValidToken,
	protectRouteByRole([UserRole.SPECIALIST]),
];
const createDestinyValidationMiddleware = [
	body("code")
		.exists({ values: "null" })
		.withMessage("Code is required")
		.isString()
		.withMessage("Code must be a string")
		.trim()
		.notEmpty()
		.withMessage("Code not must be empty")
		.escape(),
	body("description")
		.exists({ values: "null" })
		.withMessage("description is required")
		.isString()
		.withMessage("description must be a string")
		.trim()
		.notEmpty()
		.withMessage("description not must be empty")
		.escape(),
	body("state")
		.exists({ values: "null" })
		.withMessage("state is required")
		.trim()
		.isMongoId()
		.withMessage("Invalid State ID")
		.if((id) => isValidObjectId(id))
		.custom((id) => isValidDoc(id, ModelState))
		.customSanitizer((value) => new Types.ObjectId(value)),
	validateRequest,
];

// Validation and sanitization middleware for updateDestinyById
const paramIdValidationMiddleware = [
	param("id")
		.exists({ values: "null" })
		.withMessage("id is required")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("invalid id")
		.if((id) => isValidObjectId(id))
		.custom((id) => isValidDoc(id, ModelDestiny))
		.customSanitizer((value) => new Types.ObjectId(value)),
];

// Define the routes with their respective validation middleware
router.post(
	"/create",
	[...authValidation, ...createDestinyValidationMiddleware],
	DestinyController.createDestiny,
);
router.get(
	"/all",
	[
		authValidation[0],
		protectRouteByRole([UserRole.SPECIALIST, UserRole.HEAD_OF_DEPARTMENT]),
		validateRequest,
	],
	DestinyController.getAllDestinies,
);
router.get(
	"/:id",
	[
		authValidation[0],
		protectRouteByRole([UserRole.SPECIALIST, UserRole.HEAD_OF_DEPARTMENT]),
		...paramIdValidationMiddleware,
		validateRequest,
	],
	DestinyController.getDestinyById,
);
router.put(
	"/:id",
	[
		...authValidation,
		...paramIdValidationMiddleware,
		...createDestinyValidationMiddleware,
		validateRequest,
	],
	DestinyController.updateDestinyById,
);
router.delete(
	"/:id",
	[...authValidation, ...paramIdValidationMiddleware],
	DestinyController.deleteDestinyById,
);
