import type { D1Database } from "@cloudflare/workers-types";
import { Context } from "hono";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";
import { OpenAPIPostSchema } from "./models/posts";
import { z } from "zod";

export type Bindings = {
	DB: D1Database;
	JWT_SECRET: string;
	APP_ENV?: "development" | "production";
	ALLOWED_ORIGINS?: string;
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

export type AppContext = Context<AppEnvironment, any, ValidationOutput>;
