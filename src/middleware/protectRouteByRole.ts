import { UserRole } from "./../const.js";

import { handleResponse } from "./index.js";
//Asumimios que ya tenemos un usuario atenticado con un token valido, el user es agregado a la request

export const protectRouteByRole = (hasRoles: UserRole[]) => {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (req: any, res: any, next: any) => {
		// TODO: Verify that hasRoles is or has valdis roles
		const { role } = req.user;

		if (hasRoles.includes(role)) {
			return next();
		}
		return handleResponse({
			res,
			statusCode: 401,
			msg: "Unauthorized",
			error: true,
		});
	};
};
