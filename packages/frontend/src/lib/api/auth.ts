import type { AuthType } from "@kotobad/shared/src/types/";
import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getMe() {
	type resType = InferResponseType<typeof client.auth.me.$get>;
	const res = await fetcher<resType>(getApiUrl("ME"), {
		method: "GET",
		credentials: "include",
	});

	if ("error" in res) throw new Error(String(res.error));
	return res;
}

export async function signup(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.signup.$post>;
	return fetcher<resType>(getApiUrl("SIGN_UP"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
export async function login(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.login.$post>;
	return fetcher<resType>(getApiUrl("LOGIN"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}

export function logout() {
	type resType = InferResponseType<typeof client.auth.logout.$delete>;
	return fetcher<resType>(getApiUrl("LOGOUT"), {
		method: "DELETE",
		credentials: "include",
	});
}
