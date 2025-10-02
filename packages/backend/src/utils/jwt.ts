import jwt from "jsonwebtoken";
import type { UserTokenPayload } from "../types";

console.log("hello")
console.log(process.env);
const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const signAccessToken = (payload: UserTokenPayload) => {
	return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string): UserTokenPayload => {
	const decode = jwt.verify(token, ACCESS_SECRET);
	if (typeof decode === "string") {
		throw new Error("Invalid token payload");
	}
	return decode as UserTokenPayload;
};

export const signRefreshToken = (payload: UserTokenPayload) => {
	return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string): UserTokenPayload => {
	const decode = jwt.verify(token, REFRESH_SECRET);
	if (typeof decode === "string") {
		throw new Error("Invalid token payload");
	}
	return decode as UserTokenPayload;
};
