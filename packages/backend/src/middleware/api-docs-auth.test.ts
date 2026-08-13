import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { Hono } from "hono";
import {
	apiDocsAuthMiddleware,
	resolveApiDocsCredentials,
} from "./api-docs-auth";

type TestBindings = {
	API_DOCS_USERNAME?: string;
	API_DOCS_PASSWORD?: string;
};

const configuredEnvironment = {
	API_DOCS_USERNAME: "docs-user",
	API_DOCS_PASSWORD: "docs-password",
};

const basicAuthorization = (username: string, password: string) =>
	`Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

const createApiDocsTestApp = () => {
	const app = new Hono<{ Bindings: TestBindings }>();
	app.use("/doc", apiDocsAuthMiddleware);
	app.use("/doc/*", apiDocsAuthMiddleware);
	app.use("/specification", apiDocsAuthMiddleware);
	app.get("/doc", (c) => c.text("swagger-ui"));
	app.get("/doc/*", (c) => c.text("swagger-asset"));
	app.get("/specification", (c) => c.json({ openapi: "3.0.0" }));
	return app;
};

describe("resolveApiDocsCredentials", () => {
	test("returns configured credentials", () => {
		assert.deepEqual(
			resolveApiDocsCredentials({
				API_DOCS_USERNAME: "docs-user",
				API_DOCS_PASSWORD: "docs-password",
			}),
			{
				username: "docs-user",
				password: "docs-password",
			},
		);
	});

	test("returns null when either credential is missing", () => {
		assert.equal(
			resolveApiDocsCredentials({ API_DOCS_USERNAME: "docs-user" }),
			null,
		);
		assert.equal(
			resolveApiDocsCredentials({ API_DOCS_PASSWORD: "docs-password" }),
			null,
		);
	});
});

describe("apiDocsAuthMiddleware", () => {
	test("returns 503 when API docs credentials are not configured", async () => {
		const app = createApiDocsTestApp();
		const response = await app.request("http://backend.test/doc", {}, {});

		assert.equal(response.status, 503);
		assert.deepEqual(await response.json(), {
			error: "API documentation authentication is not configured",
		});
	});

	test("returns 401 when the Authorization header is missing", async () => {
		const app = createApiDocsTestApp();
		const response = await app.request(
			"http://backend.test/specification",
			{},
			configuredEnvironment,
		);

		assert.equal(response.status, 401);
		assert.match(response.headers.get("www-authenticate") ?? "", /^Basic /);
	});

	test("returns 401 when Basic Auth credentials are invalid", async () => {
		const app = createApiDocsTestApp();
		const response = await app.request(
			"http://backend.test/doc",
			{
				headers: {
					Authorization: basicAuthorization("docs-user", "wrong-password"),
				},
			},
			configuredEnvironment,
		);

		assert.equal(response.status, 401);
	});

	for (const path of ["/doc", "/doc/assets/app.js", "/specification"]) {
		test(`allows valid Basic Auth for ${path}`, async () => {
			const app = createApiDocsTestApp();
			const response = await app.request(
				`http://backend.test${path}`,
				{
					headers: {
						Authorization: basicAuthorization(
							configuredEnvironment.API_DOCS_USERNAME,
							configuredEnvironment.API_DOCS_PASSWORD,
						),
					},
				},
				configuredEnvironment,
			);

			assert.equal(response.status, 200);
		});
	}
});
