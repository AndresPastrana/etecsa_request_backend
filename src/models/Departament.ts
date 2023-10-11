import { HydratedDocument, model, Schema } from "mongoose";
import { IDepartament } from "../types.js";
const SchemaDepartament = new Schema<IDepartament>(
	{
		ccosto: { type: Schema.Types.ObjectId, ref: "CCosto", required: true }, // Reference to CCosto
		descripcion: { type: String, required: true },
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IDepartament>) {
				const { __v, _id, ...rest } = this.toObject();
				return { id: _id, ...rest };
			},
		},
	},
);
export const ModelDepartament = model<IDepartament>(
	"Departament",
	SchemaDepartament,
);
