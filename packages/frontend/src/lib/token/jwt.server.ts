import jwt from "jsonwebtoken";
import type { UserTokenPayload } from "@b3s/backend/src/types";

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
