import { Document, Schema } from "mongoose";
import { RequestStatus, UserRole } from "./const.js";

interface IProduct extends Document {
	code: string;
	name: string;
	price: number; // Assuming precio is a number
	aviableQuantity: number; // Assuming cantidadDisponible is a number
}

interface IProvince extends Document {
	name: string;
}

interface IState extends Document {
	name: string;
	province: Schema.Types.ObjectId; // Reference to Province as Schema.Types.ObjectId
}

interface IDestiny extends Document {
	code: string;
	description: string;
	state: Schema.Types.ObjectId; // Reference to a State
}
interface IBilling extends Document {
	request: Schema.Types.ObjectId; // Reference to Request as Schema.Types.ObjectId
	total_import: number;
}

interface IUser extends Document {
	username: string;
	password: string;
	email: string;
	role: UserRole;
	firstName: string;
	lastName: string;
	departamento?: Schema.Types.ObjectId; // Optional department ID
	isValidPassword: (password: string) => Promise<boolean>;
}

interface ICCosto extends Document {
	code: string;
}

interface IDepartament extends Document {
	ccosto: Schema.Types.ObjectId; // CCosto ID associated
	descripcion: string;
}
interface IResource {
	product: Schema.Types.ObjectId; // Reference to Product
	quantity: number;
}

interface IRequest extends Document {
	departament: Schema.Types.ObjectId; // Reference to Departament
	resources: Array<IResource>;
	destiny: Schema.Types.ObjectId; // Reference to Destination
	status: RequestStatus;
	aprovedBy?: Schema.Types.ObjectId; // Optional reference to User
	createdAt: Date;
}
