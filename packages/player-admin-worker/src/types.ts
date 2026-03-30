import type { drizzle } from "drizzle-orm/d1";

export type DatabaseBinding = Parameters<typeof drizzle>[0];

export type AssetBinding = {
	fetch: (
		input: Request | URL | string,
		init?: RequestInit,
	) => Promise<Response>;
};

export type R2BucketBinding = {
	put: (
		key: string,
		value: ArrayBuffer | ArrayBufferView | string | Blob,
		options?: {
			httpMetadata?: {
				contentType?: string;
				cacheControl?: string;
			};
		},
	) => Promise<unknown>;
};

export type Bindings = {
	DB: DatabaseBinding;
	ASSETS: AssetBinding;
	KOTOBAD_BUCKET: R2BucketBinding;
	PLAYER_ADMIN_API_TOKEN?: string;
	APP_ENV?: "development" | "production";
	ALLOWED_ORIGINS?: string;
	R2_PUBLIC_BASE_URL?: string;
};

export type AppEnv = {
	Bindings: Bindings;
};
