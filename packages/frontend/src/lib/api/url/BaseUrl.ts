import { getRequiredEnv } from "@/lib/config/requiredEnv";

export const API_BASE_URL = getRequiredEnv("NEXT_PUBLIC_API_URL");
