import { HydratedDocument, model, Schema } from "mongoose";
import { IProduct } from "../types.js";

const SchemaProduct = new Schema<IProduct>(
	{
		code: { type: String, required: true, unique: true },
		name: { type: String, required: true, unique: true },
		price: { type: Number, required: true },
		aviableQuantity: { type: Number, required: false, default: 0 },
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IProduct>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

export const ModelProduct = model<IProduct>("Product", SchemaProduct);
