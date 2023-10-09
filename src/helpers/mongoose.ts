import { HydratedDocument } from "mongoose";

// Define a function for transforming documents
export function transformDocument<T>(document: HydratedDocument<T>) {
	const { __v, _id, ...rest } = document;
	return { id: _id, ...rest };
}
