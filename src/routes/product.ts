import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { ProductController } from "../controllers/index.js";
import { UserRole } from "./../const.js";
import {
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
export const router = Router();

const authValidations = [isValidToken];

const createOrUpdateValidationRules = [
	body("code").trim().notEmpty().withMessage("Code is required").isString(),
	body("name").trim().notEmpty().withMessage("Name is required").isString(),
	body("price").isNumeric().withMessage("Price must be a number"),
	body("availableQuantity")
		.optional()
		.isNumeric()
		.withMessage("Available quantity must be a number"),
	validateRequest,
];

const paramIdValidations = [
	param("id")
		.trim()
		.notEmpty()
		.withMessage("ID is required")
		.isMongoId()
		.withMessage("ID must be a valid ObjectId")
		.customSanitizer((id) => new Types.ObjectId(id)),
];

router.post(
	"/",
	[
		...authValidations,
		protectRouteByRole([UserRole.SPECIALIST]),
		...createOrUpdateValidationRules,
	],
	ProductController.createProduct,
);
router.get(
	"/",
	[
		...authValidations,
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT, UserRole.SPECIALIST]),
		validateRequest,
	],
	ProductController.getAllProducts,
);
router.get(
	"/:id",
	[
		...authValidations,
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT, UserRole.SPECIALIST]),
		...paramIdValidations,
		validateRequest,
	],
	ProductController.getProductById,
);
router.put(
	"/:id",
	[
		...authValidations,
		protectRouteByRole([UserRole.SPECIALIST]),
		...paramIdValidations,
		...createOrUpdateValidationRules,
	],
	ProductController.updateProductById,
);
router.delete(
	"/:id",
	[
		...authValidations,
		protectRouteByRole([UserRole.SPECIALIST]),
		...paramIdValidations,
		validateRequest,
	],
	ProductController.deleteProductById,
);
