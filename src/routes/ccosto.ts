import { Router } from "express";
import { body } from "express-validator";
import { CCostoController } from "../controllers/index.js";
import { ModelCCosto } from "../models/index.js";
import { validateRequest } from "./../middleware/index.js";

export const router = Router();

const validationMiddleware = [
	body()
		.isArray({ min: 1 })
		.withMessage("An array of CCosto documents is required")
		.custom(async (value) => {
			if (!Array.isArray(value)) return false;

			const uniqueCodes = new Set(); // To keep track of unique codes

			for (const cCosto of value) {
				if (
					!cCosto.code ||
					typeof cCosto.code !== "string" ||
					cCosto.code.length !== 10
				) {
					return false;
				}

				// Check if the code is already in the Set (duplicate check)
				if (uniqueCodes.has(cCosto.code)) {
					return false;
				}

				// Check if the code already exists in the database
				const existingCCosto = await ModelCCosto.findOne({ code: cCosto.code });
				if (existingCCosto) {
					return false;
				}

				// Add the code to the Set to track uniqueness
				uniqueCodes.add(cCosto.code);
			}

			return true;
		})
		.withMessage(
			'Each CCosto document must have a valid "code" (string with length 10) and be unique',
		)
		.escape(),
	validateRequest,
];

// This endpoint is just for development propurses
router.post(
	"/insert-many",
	validationMiddleware,
	CCostoController.insertManyCCostos,
);
router.get("/", CCostoController.getAllCCostos);
