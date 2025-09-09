import { client } from "./honoClient";
import { fetcher } from "./fetch";
import { API_URLS } from "../config/apiUrls";
import { AuthType } from "@b3s/shared/src/types/";
import { InferResponseType } from "hono";

export async function getMe() {
	type resType = InferResponseType<typeof client.auth.me.$get>;
	const res = fetcher<resType>(API_URLS.ME, {
		method: "GET",
		credentials: "include",
	});

	if ("error" in res) throw new Error(String(res.error));
	return res;
}

export async function signup(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.signup.$post>;
	return fetcher<resType>(API_URLS.SIGN_UP, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
export async function login(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.login.$post>;
	return fetcher<resType>(API_URLS.LOGIN, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}

export function logout() {
	type resType = InferResponseType<typeof client.auth.logout.$delete>;
	return fetcher<resType>(API_URLS.LOGOUT, {
		method: "POST",
		credentials: "include",
	});
}
