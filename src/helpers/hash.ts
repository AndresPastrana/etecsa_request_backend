import { compare, hash } from "bcrypt";
const saltRounds = 10;
export const hashString = async (valueToHash: string): Promise<string> => {
	const bcryptHash = await hash(valueToHash, saltRounds);
	return bcryptHash;
};

export const compareHash = async (
	plainText: string,
	hashedData: string,
): Promise<Boolean> => {
	const isTheSame = await compare(plainText, hashedData);
	return isTheSame;
};
