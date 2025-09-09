import { readdirSync } from "fs";
import { defineConfig } from "drizzle-kit";

const isProduction = process.env.NODE_ENV === "production";
const sqliteDirPath = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";
const sqliteFilePath = readdirSync(sqliteDirPath).find((file) =>
	file.endsWith(".sqlite"),
);

const config = isProduction
	? defineConfig({
			out: "./drizzle/migrations",
			schema: "./drizzle/schema.ts",
			dialect: "sqlite",
			driver: "d1-http",
			dbCredentials: {
				accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
				databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
				token: process.env.CLOUDFLARE_TOKEN!,
			},
		})
	: defineConfig({
			out: "./drizzle/migrations",
			schema: "./drizzle/schema.ts",
			dialect: "sqlite",
			dbCredentials: {
				url: `${sqliteDirPath}/${sqliteFilePath}`,
			},
		});

export default config;
