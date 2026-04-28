import { getRequiredEnv } from "@/lib/config/requiredEnv";
import { getClientOrigin } from "./clientOrigin";

export const FRONTEND_BASE_URL = getRequiredEnv("NEXT_PUBLIC_FRONTEND_URL");

const resolveBaseUrl = async (): Promise<string> => {
	if (typeof window !== "undefined") {
		return getClientOrigin();
	}

	return FRONTEND_BASE_URL;
};

export const getApiBaseUrl = resolveBaseUrl;
