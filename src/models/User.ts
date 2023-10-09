import { HydratedDocument, model, Schema } from "mongoose";
import { UserRole } from "../const.js";
import { compareHash, transformDocument } from "../helpers/index.js";
import { IUser } from "../types.js";
const SchemaUser = new Schema<IUser>(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true },
		role: { type: String, enum: Object.values(UserRole), required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		departamento: { type: Schema.Types.ObjectId, ref: "Department" }, // Reference to Department
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IUser>) {
				return transformDocument(this.toObject());
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
