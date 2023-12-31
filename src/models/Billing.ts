import { HydratedDocument, model, Schema } from "mongoose";
import { IBilling } from "../types.js";

const SchemaBilling = new Schema<IBilling>(
	{
		request: {
			type: Schema.Types.ObjectId,
			ref: "Request",
			required: true,
		},
		total_import: {
			type: Number,
			required: true,
		},
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IBilling>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

// Create a Mongoose model based on the schema
export const ModelIBilling = model<IBilling>("Billing", SchemaBilling);
