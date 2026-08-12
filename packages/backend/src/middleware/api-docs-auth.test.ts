import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { resolveApiDocsCredentials } from "./api-docs-auth";

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
