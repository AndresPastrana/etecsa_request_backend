import { Router } from "express";
import { body, param, query } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import { UserRole } from "../const.js";
import { protectRouteByRole } from "../middleware/protectRouteByRole.js";
import { ModelDepartament, ModelUser } from "../models/index.js";
import { UserController } from "./../controllers/index.js";
import {
	isValidDoc,
	isValidToken,
	validateRequest,
} from "./../middleware/index.js";
// TODO:
// Solamnte se pueden insertar usarios con el role HEAD of Department for the demo porpuse
export const router = Router();

const authValidatonMiddlewares = [
	isValidToken,
	protectRouteByRole([UserRole.SPECIALIST]),
];

// Validation and sanitization middleware for createUser
const createUserValidationMiddleware = [
	body("username")
		.exists()
		.withMessage("username is required")
		.isString()
		.withMessage("username must be a string")
		.trim()
		.notEmpty()
		.withMessage("username not must be empty")
		.escape(),
	body("password")
		.exists()
		.isString()
		.trim()
		.notEmpty()
		.withMessage("Password not must be empty")
		.isStrongPassword()
		.withMessage("Weak password")
		.escape(),
	body("email")
		.exists()
		.isEmail()
		.normalizeEmail()
		.withMessage("Invalid email address")
		.escape(),
	body("firstName")
		.exists()
		.withMessage("firstName is required")
		.isString()
		.withMessage("firstName must be a string")
		.trim()
		.notEmpty()
		.withMessage("firstName not must be empty")
		.escape(),
	body("lastName")
		.exists()
		.withMessage("lastName is required")
		.trim()
		.isString()
		.withMessage("lastName must be a string")
		.notEmpty()
		.withMessage("lastName not must be empty")
		.escape(),
	body("role")
		.exists({ values: "null" })
		.withMessage("role is required")
		.trim()
		.isString()
		.withMessage("role is must be a string")
		.isIn([UserRole.HEAD_OF_DEPARTMENT]) // We just can insert HEAD_OF_DEPARTMENT users by now
		.withMessage("invalid role")
		.notEmpty()
		.withMessage("role is required")
		.escape(),

	body("departament")
		.exists({ values: "null" })
		.withMessage("departament is required")
		.escape()
		.trim()
		.isMongoId()
		.withMessage("Invalid departament ID")
		.if((id) => isValidObjectId(id))
		.custom((id) => isValidDoc(id, ModelDepartament))
		.customSanitizer((id) => new Types.ObjectId(id)),
	// .optional() //Make this field optional to insert also SPECIALIST
];

const paramIdValidationMiddleware = [
	param("id")
		.exists({ values: "null" })
		.withMessage("id is required")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("invalid id")
		.if((id) => isValidObjectId(id))
		.custom((id) => isValidDoc(id, ModelUser))
		.customSanitizer((value) => new Types.ObjectId(value)),
];

// Validation middleware for getUsersByRole
const getUsersByRoleValidationMiddleware = [
	query("role")
		.exists({ values: "null" })
		.withMessage("Role is required")
		.trim()
		.escape()
		.isString()
		.withMessage("Role must be a string")
		.notEmpty()
		.withMessage("Role must not be an empty string")
		.isIn([UserRole.HEAD_OF_DEPARTMENT]) // Just alloe the get all the HEADS of departament
		.withMessage("Unsuported role"),
];

// Define the routes with their respective validation middleware
router.post(
	"/create",
	[
		...authValidatonMiddlewares,
		...createUserValidationMiddleware,
		validateRequest,
	],
	UserController.createUser,
);
router.get(
	"/by-role",
	[
		...authValidatonMiddlewares,
		...getUsersByRoleValidationMiddleware,
		validateRequest,
	],
	UserController.getUsersByRole,
);
router.get(
	"/:id",
	[
		authValidatonMiddlewares[0],
		protectRouteByRole(Object.values(UserRole)),
		...paramIdValidationMiddleware,
		validateRequest,
	],
	UserController.getUserById,
);
router.put(
	"/:id",
	[
		...authValidatonMiddlewares,
		...paramIdValidationMiddleware,
		...createUserValidationMiddleware,
	],
	UserController.updateUserById,
);
router.delete(
	"/:id",
	[
		...authValidatonMiddlewares,
		...paramIdValidationMiddleware,
		validateRequest,
	],
	UserController.deleteUserById,
);


export default router;
