import { IState } from "../types.js";

import { HydratedDocument, model, Schema } from "mongoose";

const StateSchema = new Schema<IState>(
	{
		name: { type: String, required: true },
		province: {
			type: Schema.Types.ObjectId,
			ref: "Province",
			required: true,
		},
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IState>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

// Create a Mongoose model for State
export const ModelState = model<IState>("State", StateSchema);
