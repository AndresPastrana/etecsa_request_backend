import express from "express";
import { body, param } from "express-validator";
import { ProvinceController } from "../controllers/index.js";
import { validateRequest } from "../middleware/index.js";
export const router = express.Router();

// This routes will be public by now ,no JWT needed for the moment
router.post(
	"/",
	[
		body("name").trim().notEmpty().withMessage("Name is required").isString(),
		validateRequest,
	],
	ProvinceController.createProvince,
);
router.get("/", ProvinceController.getAllProvinces);
router.get(
	"/:id",
	[
		param("id").trim().notEmpty().withMessage("ID is required").isMongoId(),
		validateRequest,
	],
	ProvinceController.getProvinceById,
);
router.put(
	"/:id",
	[
		param("id").trim().notEmpty().withMessage("ID is required").isMongoId(),
		validateRequest,
	],
	ProvinceController.updateProvinceById,
);
router.delete(
	"/:id",
	[
		param("id").trim().notEmpty().withMessage("ID is required").isMongoId(),
		validateRequest,
	],
	ProvinceController.deleteProvinceById,
);
