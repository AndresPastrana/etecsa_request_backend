import mongoose from "mongoose";

export const dbConection = async () => {
	console.log(process.env.MONGO_DB_DEV);

	const URL = process.env.MONGO_DB_DEV || "";
	const db = await mongoose.connect(URL);
	return db;
};
