import { HydratedDocument, model, Schema, Types } from "mongoose";
import { transformDocument } from "../helpers/mongoose.js";
import { IDestiny } from "../types.js";
const SchemaDestiny = new Schema<IDestiny>(
	{
		code: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		state: { type: Types.ObjectId, ref: "State", required: true }, // Reference to State
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IDestiny>) {
				return transformDocument(this.toObject());
			},
		},
	},
);

// Create a Mongoose model for Destiny
export const ModelDestiny = model<IDestiny>("Destiny", SchemaDestiny);
