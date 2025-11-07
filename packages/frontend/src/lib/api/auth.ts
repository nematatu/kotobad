import type { AuthType } from "@kotobad/shared/src/types/";
import type { InferResponseType } from "hono";
import { getApiUrl } from "../config/apiUrls";
import { fetcher } from "./fetch";
import type { client } from "./honoClient";

export async function getMe() {
	type resType = InferResponseType<typeof client.auth.me.$get>;
	const url = await getApiUrl("ME");
	const res = await fetcher<resType>(url, {
		method: "GET",
		credentials: "include",
	});

	if ("error" in res) throw new Error(String(res.error));
	return res;
}

export async function signup(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.signup.$post>;
	const url = await getApiUrl("SIGN_UP");
	return fetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}

export async function login(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.login.$post>;
	const url = await getApiUrl("LOGIN");
	return fetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}

export async function logout() {
	type resType = InferResponseType<typeof client.auth.logout.$delete>;
	const url = await getApiUrl("LOGOUT");
	return fetcher<resType>(url, {
		method: "DELETE",
		credentials: "include",
	});
}
