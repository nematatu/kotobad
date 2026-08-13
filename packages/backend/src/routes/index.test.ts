import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { INTERNAL_AUTH_HEADERS } from "@kotobad/shared/src/const/internalAuthHeaders";
import { signHmac } from "@kotobad/shared/src/utils/internalAuth/signHmac";
import mainRouter from ".";

const ALLOWED_ORIGIN = "https://kotobad.com";
const CSRF_TOKEN = "csrf-token-for-main-router-test";
const INTERNAL_API_SECRET = "internal-secret-for-main-router-test";
const REQUEST_METHOD = "POST";
const REQUEST_TARGET = "/bbs/not-found-for-middleware-order?source=test";
const REQUEST_URL = `http://backend.test${REQUEST_TARGET}`;

const requestEnvironment = {
	ALLOWED_ORIGINS: ALLOWED_ORIGIN,
	INTERNAL_API_SECRET,
};

const validCsrfHeaders = {
	Origin: ALLOWED_ORIGIN,
	Cookie: `__Host-csrf_token=${CSRF_TOKEN}`,
	"X-CSRF-Token": CSRF_TOKEN,
};

const createInternalAuthHeaders = async () => {
	const timestamp = String(Date.now());
	return {
		[INTERNAL_AUTH_HEADERS.TS]: timestamp,
		[INTERNAL_AUTH_HEADERS.SIG]: await signHmac(
			INTERNAL_API_SECRET,
			`${REQUEST_METHOD}\n${REQUEST_TARGET}\n${timestamp}`,
		),
	};
};

describe("mainRouter security middleware order", () => {
	test("rejects an invalid CSRF token before internal authentication", async () => {
		const response = await mainRouter.request(
			REQUEST_URL,
			{
				method: REQUEST_METHOD,
				headers: {
					...validCsrfHeaders,
					"X-CSRF-Token": "mismatched-token",
				},
			},
			requestEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), {
			error: "Invalid CSRF token.",
		});
	});

	test("rejects missing internal authentication after valid CSRF validation", async () => {
		const response = await mainRouter.request(
			REQUEST_URL,
			{
				method: REQUEST_METHOD,
				headers: validCsrfHeaders,
			},
			requestEnvironment,
		);

		assert.equal(response.status, 403);
		assert.deepEqual(await response.json(), { error: "Unauthorized" });
	});

	test("reaches routing and returns 404 after valid CSRF and internal authentication", async () => {
		const internalAuthHeaders = await createInternalAuthHeaders();
		const response = await mainRouter.request(
			REQUEST_URL,
			{
				method: REQUEST_METHOD,
				headers: {
					...validCsrfHeaders,
					...internalAuthHeaders,
				},
			},
			requestEnvironment,
		);

		assert.equal(response.status, 404);
	});
});
