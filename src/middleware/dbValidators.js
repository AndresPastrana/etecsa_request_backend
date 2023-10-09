import { isValidObjectId, Types } from "mongoose";

export const isValidDoc = async (id, Model, throwIfExist = false) => {
	if (isValidObjectId(id)) {
		const _id = new Types.ObjectId(id);
		const doc = await Model.findById(_id);
		if ((doc && throwIfExist === true) || (!doc && throwIfExist === false)) {
			throw new Error("Invalid id");
		}
		return true;
	}

	throw new Error("Invalid id");
};
