import { HydratedDocument, model, Schema } from "mongoose";
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

const SchemaRequest = new Schema<IRequest>(
	{
		status: {
			type: String,
			required: false,
			default: RequestStatus.PENDING,
			enum: Object.values(RequestStatus),
		},
		departament: {
			type: Schema.Types.ObjectId,
			ref: "Departament",
			required: true,
		},
		resources: {
			type: [ResourceSchema],
			required: true,
		},
		destiny: {
			type: Schema.Types.ObjectId,
			ref: "Destiny",
		},
		aprovedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
	},
	{
		timestamps: true,
		methods: {
			toJSON: function (this: HydratedDocument<IRequest>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);

export const ModelRequest = model<IRequest>("Request", SchemaRequest);
