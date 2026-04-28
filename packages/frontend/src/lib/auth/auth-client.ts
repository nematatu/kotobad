import { createAuthClient } from "better-auth/react";
import { FRONTEND_BASE_URL } from "@/lib/api/url/BaseBffUrl";

const buildBaseUrl = () => {
	if (typeof window !== "undefined") {
		return `${window.location.origin}/auth/api`;
	}

	return `${FRONTEND_BASE_URL.replace(/\/$/, "")}/auth/api`;
};

const authClient = createAuthClient({
	baseURL: buildBaseUrl(),
});

export const { signIn, signOut, useSession } = authClient;
