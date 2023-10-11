import { HydratedDocument, model, Schema } from "mongoose";
import { ICCosto } from "../types.js";

const SchemaCCosto = new Schema<ICCosto>(
	{
		code: {
			type: String,
			required: true,
			minlength: 10,
			maxlength: 10,
			unique: true,
		},
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<ICCosto>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

// Create a Mongoose model based on the schema
export const ModelCCosto = model<ICCosto>("CCosto", SchemaCCosto);
