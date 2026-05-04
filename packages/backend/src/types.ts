import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../drizzle/schema";

export type Bindings = {
	DB: D1Database;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL?: string;
	APP_ENV?: "development" | "production";
	ALLOWED_ORIGINS?: string;
	DEVELOPER_NOTE_AUTHOR_IDS?: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	KOTOBAD_BUCKET: R2Bucket;
	R2_PUBLIC_BASE_URL?: string;
	THREAD_ROOM: DurableObjectNamespace;
	INTERNAL_API_SECRET: string;
	TURNSTILE_SECRET_KEY?: string;
	TURNSTILE_ENFORCE_SCOPES?: string;
	TURNSTILE_ALLOWED_HOSTNAMES?: string;
};

export type BetterAuthUserTokenPayload = {
	id: string;
	username: string;
};

export type Variables = {
	db: DrizzleD1Database<typeof schema>;
	betterAuthUser: BetterAuthUserTokenPayload;
};

export type AppEnvironment = {
	Bindings: Bindings;
	Variables: Variables;
};
