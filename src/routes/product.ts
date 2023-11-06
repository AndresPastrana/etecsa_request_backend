import { Router } from "express";
import { body, param } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { ProductController } from "../controllers/index.js";
import { UserRole } from "./../const.js";
import {
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
export const router = Router();

const authValidations = [
	isValidToken,
	protectRouteByRole([UserRole.SPECIALIST]),
];

const createOrUpdateValidationRules = [
	body("code")
		.exists()
		.withMessage("code is required")
		.trim()
		.notEmpty()
		.withMessage("code not must be empty")
		.isString()
		.withMessage("code  must be a string")
		.escape(),
	body("name")
		.exists()
		.withMessage("name is required")
		.trim()
		.notEmpty()
		.withMessage("name not must be empty")
		.isString()
		.withMessage("name  must be a string")
		.escape(),
	body("price")
		.exists()
		.withMessage("price is required")
		.isNumeric()
		.withMessage("Price must be a number"),
	body("aviableQuantity")
		.optional()
		.exists()
		.withMessage("aviableQuantity is required")
		.isNumeric()
		.withMessage("aviableQuantity must be a number"),
	validateRequest,
];

const paramIdValidations = [
	param("id")
		.trim()
		.notEmpty()
		.withMessage("ID is required")
		.isMongoId()
		.withMessage("ID must be a valid ObjectId")
		.if((value) => isValidObjectId(value))
		.customSanitizer((id) => new Types.ObjectId(id)),
];

router.post(
	"/create",
	[...authValidations, ...createOrUpdateValidationRules],
	ProductController.createProduct,
);
router.get(
	"/",
	[
		authValidations[0],
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT, UserRole.SPECIALIST]),
		validateRequest,
	],
	ProductController.getAllProducts,
);
router.get(
	"/:id",
	[
		authValidations[0],
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT, UserRole.SPECIALIST]),
		...paramIdValidations,
		validateRequest,
	],
	ProductController.getProductById,
);
router.put(
	"/:id",
	[...authValidations, ...paramIdValidations, ...createOrUpdateValidationRules],
	ProductController.updateProductById,
);
router.delete(
	"/:id",
	[...authValidations, ...paramIdValidations, validateRequest],
	ProductController.deleteProductById,
);
