import jwt from "jsonwebtoken";
import type { UserTokenPayload } from "@kotobad/backend/src/types";

export function verifyJwtServer(
	token: string,
	secret: string,
): Promise<UserTokenPayload> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, payload) => {
			if (err) reject(err);
			resolve(payload as UserTokenPayload);
		});
	});
}
