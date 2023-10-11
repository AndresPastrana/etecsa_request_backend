import { HydratedDocument, model, Schema, Types } from "mongoose";
import { IDestiny } from "../types.js";
const SchemaDestiny = new Schema<IDestiny>(
	{
		code: { type: String, required: true, unique: true },
		description: { type: String, required: true, unique: true },
		state: { type: Types.ObjectId, ref: "State", required: true }, // Reference to State
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IDestiny>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

// Create a Mongoose model for Destiny
export const ModelDestiny = model<IDestiny>("Destiny", SchemaDestiny);
