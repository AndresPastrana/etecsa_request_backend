import { HydratedDocument, model, Schema } from "mongoose";
import { IProvince } from "../types.js";
// Create a Mongoose schema for Province
const ProvinceSchema = new Schema<IProvince>(
	{
		name: { type: String, required: true },
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IProvince>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

// Create a Mongoose model for Province
export const ModelProvince = model<IProvince>("Province", ProvinceSchema);
