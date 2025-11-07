const SECURE_ENVS = new Set(["production", "preview", "dev-prod"]);

export const resolveCookieSecurity = (
	appEnv: string | undefined,
): { secure: boolean; sameSite: "none" | "lax" } => {
	const secure = SECURE_ENVS.has(appEnv ?? "");
	return {
		secure,
		sameSite: secure ? "none" : "lax",
	};
};
