import { Router } from "express";
import { UserRole } from "../const.js";
import { CCostoController } from "../controllers/index.js";
import { isValidToken, protectRouteByRole } from "./../middleware/index.js";

export const router = Router();

const authMiddleware = [
	isValidToken,
	protectRouteByRole([UserRole.SPECIALIST]),
];
// const validationMiddleware = [
// 	body()
// 		.isArray({ min: 1 })
// 		.withMessage("An array of CCosto documents is required")
// 		.custom(async (value) => {
// 			console.log(value);

// 			const uniqueCodes = new Set(); // To keep track of unique codes
// 			for (const cCosto of value) {
// 				if (
// 					!cCosto.code ||
// 					typeof cCosto.code !== "string" ||
// 					cCosto.code.length !== 10
// 				) {
// 					return false;
// 				}

// 				// Check if the code is already in the Set (duplicate check)
// 				if (uniqueCodes.has(cCosto.code)) {
// 					return false;
// 				}

// 				// Check if the code already exists in the database
// 				const existingCCosto = await ModelCCosto.findOne({ code: cCosto.code });
// 				if (existingCCosto) {
// 					return false;
// 				}

// 				// Add the code to the Set to track uniqueness
// 				uniqueCodes.add(cCosto.code);
// 			}
// 			return true;
// 		})
// 		.withMessage(
// 			'Each CCosto document must have a valid "code" (string with length 10) and be unique',
// 		)
// 		.escape(),
// 	validateRequest,
// ];

// This endpoint is just for development propurses
// router.post(
// 	"/insert-many",
// 	validationMiddleware,
// 	CCostoController.insertManyCCostos,
// );
router.get("/", authMiddleware, CCostoController.getAllCCostos);
