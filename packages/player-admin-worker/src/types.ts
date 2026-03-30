import type { drizzle } from "drizzle-orm/d1";

export type DatabaseBinding = Parameters<typeof drizzle>[0];

export type AssetBinding = {
	fetch: (
		input: Request | URL | string,
		init?: RequestInit,
	) => Promise<Response>;
};

export type Bindings = {
	DB: DatabaseBinding;
	ASSETS: AssetBinding;
	PLAYER_ADMIN_API_TOKEN?: string;
	APP_ENV?: "development" | "production";
	ALLOWED_ORIGINS?: string;
};

export type AppEnv = {
	Bindings: Bindings;
};
