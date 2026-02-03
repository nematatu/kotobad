import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";
import { BETTER_AUTH_BASE_PATH } from "./auth";

const ensureEnvFromDevVars = () => {
	const moduleDir = dirname(fileURLToPath(import.meta.url));
	const envPath = resolve(moduleDir, ".dev.vars");
	if (!existsSync(envPath)) {
		return;
	}
	const content = readFileSync(envPath, "utf-8");
	for (const line of content.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}
		const [rawKey, ...rawValueParts] = trimmed.split("=");
		if (!rawKey || rawValueParts.length === 0) {
			continue;
		}
		const key = rawKey.trim();
		if (!key || process.env[key]) {
			continue;
		}
		const rawValue = rawValueParts.join("=").trim();
		const matched = rawValue.match(/^"?(.*?)"?$/);
		process.env[key] = matched ? matched[1] : rawValue;
	}
};

if (!process.env.BETTER_AUTH_SECRET) {
	ensureEnvFromDevVars();
}

const secret = process.env.BETTER_AUTH_SECRET!;

const cliDb = drizzle(new Database(":memory:"), { schema });

export const auth = betterAuth({
	secret,
	baseURL: process.env.BETTER_AUTH_URL,
	basePath: BETTER_AUTH_BASE_PATH,
	database: drizzleAdapter(cliDb, {
		provider: "sqlite",
	}),
});
