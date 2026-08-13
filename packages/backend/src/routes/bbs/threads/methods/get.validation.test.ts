import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { OpenAPIHono } from "@hono/zod-openapi";
import { PERPAGE } from "@kotobad/shared/src/config/thread";
import { searchThreadRoute } from "./get";

type SearchQuery = {
	q: string;
	page: number;
	limit: number;
	sort: "new" | "old";
};

const createSearchValidationApp = (
	onValidated: (query: SearchQuery) => void,
) => {
	const app = new OpenAPIHono();
	app.openapi(searchThreadRoute, (c) => {
		onValidated(c.req.valid("query"));
		return c.json({ threads: [], totalCount: 0 }, 200);
	});
	return app;
};

describe("searchThreadRoute query validation", () => {
	test("accepts the maximum result limit", async () => {
		const validatedQueries: SearchQuery[] = [];
		const app = createSearchValidationApp((query) => {
			validatedQueries.push(query);
		});

		const response = await app.request(
			`http://backend.test/search?q=test&limit=${PERPAGE}`,
		);

		assert.equal(response.status, 200);
		assert.deepEqual(validatedQueries, [
			{
				q: "test",
				page: 1,
				limit: PERPAGE,
				sort: "new",
			},
		]);
	});

	test("rejects a result limit above the maximum before the handler runs", async () => {
		let handlerCallCount = 0;
		const app = createSearchValidationApp(() => {
			handlerCallCount += 1;
		});

		const response = await app.request(
			`http://backend.test/search?q=test&limit=${PERPAGE + 1}`,
		);

		assert.equal(response.status, 400);
		assert.equal(handlerCallCount, 0);
	});

	test("uses the existing default result limit", async () => {
		const validatedQueries: SearchQuery[] = [];
		const app = createSearchValidationApp((query) => {
			validatedQueries.push(query);
		});

		const response = await app.request("http://backend.test/search?q=test");

		assert.equal(response.status, 200);
		assert.equal(validatedQueries[0]?.limit, 20);
	});
});
