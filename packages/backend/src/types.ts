import type { D1Database } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";
import type { z } from "zod";
import type * as schema from "../drizzle/schema";
import type { OpenAPIPostSchema } from "./models/posts";

export type Bindings = {
	DB: D1Database;
	JWT_SECRET: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL?: string;
	APP_ENV?: "development" | "production";
	ALLOWED_ORIGINS?: string;
	ALLOW_CF_PAGES_PREVIEW?: string;
	CF_PAGES_PREVIEW_SUFFIX?: string;
};

export type UserTokenPayload = {
	id: number;
	username: string;
};

export type Variables = {
	db: DrizzleD1Database<typeof schema>;
	user: UserTokenPayload;
};

type ValidatedData = z.infer<typeof OpenAPIPostSchema>;

type ValidationOutput = {
	out: {
		json: ValidatedData;
	};
};

export type AppEnvironment = {
	Bindings: Bindings;
	Variables: Variables;
};

export type AppContext = Context<AppEnvironment, string, ValidationOutput>;
