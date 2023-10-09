import { model, Schema } from "mongoose";
import { RequestStatus } from "../const.js";
import { IRequest, IResource } from "../types.js";

const ResourceSchema = new Schema<IResource>({
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product",
	},
	quantity: {
		type: Number,
		required: true,
	},
});

const SchemaRequest = new Schema<IRequest>({
	status: {
		type: String,
		default: RequestStatus.PENDING,
		enum: Object.values(RequestStatus),
		required: false,
	},
	aprovedBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	departament: {
		type: Schema.Types.ObjectId,
		ref: "Departament",
		required: false,
	},
	resources: {
		type: [ResourceSchema],
		required: true,
	},
	destiny: {
		type: Schema.Types.ObjectId,
		ref: "Destiny",
	},
});

export const ModelRequest = model<IRequest>("Request", SchemaRequest);
