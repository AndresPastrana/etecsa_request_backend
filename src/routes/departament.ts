import { Router } from "express";
import { body, param } from "express-validator";
import { Types } from "mongoose";
import { UserRole } from "../const.js";
import { DepartamentController } from "../controllers/index.js";
import {
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
export const router = Router();

const authValidator = [isValidToken, protectRouteByRole([UserRole.SPECIALIST])];
// Validation and sanitization middleware for createDepartament
const createDepartamentValidationMiddleware = [
	body("ccosto")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("Invalid CCosto ID")
		.customSanitizer((value) => new Types.ObjectId(value)),

	body("descripcion")
		.trim()
		.escape()
		.isString()
		.notEmpty()
		.withMessage("Descripcion is required"),
	validateRequest,
];

const paramIdDepartamentValidationMiddleware = [
	param("id")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("Invalid Departament ID")
		.customSanitizer((value) => new Types.ObjectId(value)),
];

router.post(
	"/",
	[...authValidator, ...createDepartamentValidationMiddleware],
	DepartamentController.createDepartament,
);
router.get("/", authValidator, DepartamentController.getAllDepartaments);
// TODO: the head of department should be able to see his own departaments information
router.get(
	"/:id",
	[
		authValidator[0],
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT, UserRole.SPECIALIST]),
		...paramIdDepartamentValidationMiddleware,
		validateRequest,
	],
	DepartamentController.getDepartamentById,
);
router.put(
	"/:id",
	[
		...authValidator,
		...paramIdDepartamentValidationMiddleware,
		...createDepartamentValidationMiddleware,
	],
	DepartamentController.updateDepartamentById,
);
router.delete(
	"/:id",
	[
		...authValidator,
		...paramIdDepartamentValidationMiddleware,
		validateRequest,
	],
	DepartamentController.deleteDepartamentById,
);
