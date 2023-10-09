import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { UserRole } from "./../const.js";
import { DestinyController } from "./../controllers/index.js";
import {
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";

export const router = Router();

const authValidation = [
	isValidToken,
	protectRouteByRole([UserRole.SPECIALIST]),
];
const createDestinyValidationMiddleware = [
	body("code").isString().trim().notEmpty().withMessage("Code is required"),
	body("description")
		.isString()
		.trim()
		.notEmpty()
		.withMessage("Description is required"),
	body("state")
		.isMongoId()
		.withMessage("Invalid State ID")
		.customSanitizer((value) => new Types.ObjectId(value)),
	validateRequest,
];

// Validation middleware for getDestinyById
const getDestinyByIdValidationMiddleware = [
	param("id")
		.isMongoId()
		.withMessage("Invalid Destiny ID")
		.customSanitizer((value) => new Types.ObjectId(value)),
];

// Validation and sanitization middleware for updateDestinyById
const updateDestinyByIdValidationMiddleware = [
	param("id")
		.isMongoId()
		.withMessage("Invalid Destiny ID")
		.customSanitizer((value) => new Types.ObjectId(value)),
	body("code").isString().trim().notEmpty().withMessage("Code is required"),
	body("description")
		.isString()
		.trim()
		.notEmpty()
		.withMessage("Description is required"),
	body("state")
		.isMongoId()
		.withMessage("Invalid State ID")
		.customSanitizer((value) => new Types.ObjectId(value)),
];

// Define the routes with their respective validation middleware
router.post(
	"/",
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
		...getDestinyByIdValidationMiddleware,
		validateRequest,
	],
	DestinyController.getDestinyById,
);
router.put(
	"/:id",
	[
		...authValidation,
		...updateDestinyByIdValidationMiddleware,
		validateRequest,
	],
	DestinyController.updateDestinyById,
);
router.delete(
	"/:id",
	[...authValidation, ...getDestinyByIdValidationMiddleware],
	DestinyController.deleteDestinyById,
);
