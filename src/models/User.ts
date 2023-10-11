import { HydratedDocument, model, Schema } from "mongoose";
import { UserRole } from "../const.js";
import { compareHash } from "../helpers/index.js";
import { IUser } from "../types.js";
const SchemaUser = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		role: { type: String, enum: Object.values(UserRole), required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		departament: {
			type: Schema.Types.ObjectId,
			ref: "Department",
			required: false,
		}, // Reference to Department
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IUser>) {
				const { __v, _id, password, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
			isValidPassword: async function (password: string) {
				const user = this.toObject();
				const isSame = await compareHash(password, user.password);
				return isSame;
			},
		},
	},
);

export const ModelUser = model<IUser>("User", SchemaUser);
