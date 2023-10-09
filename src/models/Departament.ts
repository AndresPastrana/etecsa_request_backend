import { HydratedDocument, model, Schema } from "mongoose";
import { transformDocument } from "../helpers/index.js";
import { IDepartament } from "../types.js";
const SchemaDepartament = new Schema<IDepartament>(
	{
		ccosto: { type: Schema.Types.ObjectId, ref: "CCosto", required: true }, // Reference to CCosto
		descripcion: { type: String, required: true },
	},
	{
		methods: {
			toJSON: function (this: HydratedDocument<IDepartament>) {
				return transformDocument(this.toObject());
			},
		},
	},
);
export const ModelDepartament = model<IDepartament>(
	"Departament",
	SchemaDepartament,
);
