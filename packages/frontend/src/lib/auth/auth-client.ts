import { createAuthClient } from "better-auth/react";

const buildBaseUrl = () => {
	if (typeof window !== "undefined") {
		return `${window.location.origin}/auth/api`;
	}
	const frontendUrl =
		process.env.NEXT_PUBLIC_FRONTEND_URL ??
		process.env.NEXT_PUBLIC_FRONTEND_URL_PRODUCT ??
		"http://localhost:3000";
	return `${frontendUrl.replace(/\/$/, "")}/auth/api`;
};

export const authClient = createAuthClient({
	baseURL: buildBaseUrl(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
