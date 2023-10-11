import { Router } from "express";
import { body, param, query } from "express-validator";
import { isValidObjectId, Types } from "mongoose";
import {
	ModelDepartament,
	ModelDestiny,
	ModelRequest,
} from "../models/index.js";
import { IProduct } from "../types.js";
import { RequestStatus, UserRole } from "./../const.js";
import { RequetsController } from "./../controllers/index.js";
import {
	isValidDoc,
	isValidToken,
	protectRouteByRole,
	validateRequest,
} from "./../middleware/index.js";
import { ModelProduct } from "./../models/index.js";
export const router = Router();
const authValidations = [
	isValidToken,
	protectRouteByRole([UserRole.SPECIALIST]),
];

const createRequestValidations = [
	body("destiny")
		.exists({ values: "null" })
		.withMessage("destiny is required")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("invalid destiny id")
		.if((id) => isValidObjectId(id))
		.custom((id) => isValidDoc(id, ModelDestiny))
		.customSanitizer((id) => new Types.ObjectId(id)),

	body("resources")
		.isArray({ min: 1 })
		.withMessage("resources must be an array with one element at least"),
	body(["resources.*.product", "resources.*.quantity"])
		.exists({
			values: "null",
		})
		.withMessage("Invalid product or quantity values"),
	body("resources.*.product")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("Invalid product id")
		.if((produtc) => isValidObjectId(produtc))
		.custom((produtc) => isValidDoc(produtc, ModelProduct)),
	body("resources.*.quantity")
		.trim()
		.escape()
		.isInt()
		.withMessage("quantity must be a number<integer>"),
];

const RequetsValidator = [
	param("id")
		.exists({ values: "falsy" })
		.withMessage("Invalid request id")
		.escape()
		.trim()
		.isMongoId()
		.withMessage("Invalid request id")
		.if((id) => isValidObjectId(id))
		.customSanitizer((id) => new Types.ObjectId(id))
		.custom((id) => isValidDoc(id, ModelRequest))
		.custom(async (id) => {
			const request = await ModelRequest.findOne({
				_id: id,
				status: RequestStatus.PENDING,
			});
			if (request) {
				return true;
			}
			throw new Error("Request not found");
		}),
];

const aproveARequestVlidator = [
	param("id")
		.if((id) => isValidObjectId(id))
		.customSanitizer((id) => new Types.ObjectId(id))
		.custom(async (id) => {
			const request = await ModelRequest.findOne({
				_id: id,
				status: RequestStatus.PENDING,
			});
			if (!request) {
				throw new Error("This request has alredy been denied or aproved");
			}

			// TODO: Get the products that i need the info
			const promises = request?.resources.map(async ({ product }) => {
				const query = ModelProduct.findById(product);

				return await query.exec();
			});
			const products = await Promise.all(promises as Array<Promise<IProduct>>);

			// TODO: Compare all the aviableQuantity with the requested quantity
			request?.resources.forEach(({ product, quantity }) => {
				const str_id = product.toString();
				const filterProduct = products.find((p) => p.id === str_id);
				if (filterProduct) {
					if (quantity > filterProduct.aviableQuantity) {
						throw new Error(
							`This request can not be aproved, product: ${filterProduct?.name} , aviableQuantity: ${filterProduct?.aviableQuantity},and you requested:${quantity}`,
						);
					}
				}
			});

			return true;
		}),
];

const getByStatusValidator = [
	query("status")
		.exists({ values: "falsy" })
		.withMessage("status is required")
		.trim()
		.escape()
		.isString()
		.withMessage("status msut be a string")
		.isIn([...Object.values(RequestStatus), "all"])
		.withMessage(
			`status msut be a one of ${Object.values(RequestStatus)} or \'all\'`,
		),
	query("departament")
		.trim()
		.escape()
		.isMongoId()
		.withMessage("Invalid depratament id")
		.if((departament) => isValidObjectId(departament))
		.custom((departament) => isValidDoc(departament, ModelDepartament))
		.customSanitizer((departament) => new Types.ObjectId(departament))
		.optional(),
];
router.put(
	"/aprove/:id",
	[
		...authValidations,
		...RequetsValidator,
		...aproveARequestVlidator,
		validateRequest,
	],
	RequetsController.aproveRequest,
);
router.put(
	"/denied/:id",
	[...authValidations, ...RequetsValidator, validateRequest],
	RequetsController.deniedRequest,
);

router.get(
	"/request-counts",
	[...authValidations, validateRequest],
	RequetsController.getRequestCountsByStatus,
);

//  /request/create
router.post(
	"/create",
	[
		authValidations[0],
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT]), //Only the head of departament can create a new request
		...createRequestValidations,
		validateRequest,
	],
	RequetsController.createRequest,
);

router.get(
	"/:id/pdf",
	[
		param("id")
			.exists({ values: "falsy" })
			.withMessage("Invalid request id")
			.escape()
			.trim()
			.isMongoId()
			.withMessage("Invalid request id")
			.if((id) => isValidObjectId(id))
			.customSanitizer((id) => new Types.ObjectId(id))
			.custom((id) => isValidDoc(id, ModelRequest)),
		validateRequest,
	],
	RequetsController.generatePdf,
);

router.get(
	"/",
	[
		authValidations[0],
		protectRouteByRole([UserRole.HEAD_OF_DEPARTMENT, UserRole.SPECIALIST]),
		...getByStatusValidator,
		validateRequest,
	],
	RequetsController.getAllRequest,
);
