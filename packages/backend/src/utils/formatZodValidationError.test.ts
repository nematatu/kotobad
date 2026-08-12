import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { z } from "zod";
import { formatZodValidationError } from "./formatZodValidationError";

describe("formatZodValidationError", () => {
	test("returns the complete path and message of the first issue", () => {
		const result = z
			.object({
				profile: z.object({
					name: z.string().min(2, "Name is too short"),
				}),
			})
			.safeParse({ profile: { name: "" } });

		if (result.success) throw new Error("Expected validation to fail");

		assert.equal(
			formatZodValidationError(result.error),
			"Invalid Input for profile.name: Name is too short",
		);
	});

	test("uses safe fallback values when there is no issue", () => {
		assert.equal(
			formatZodValidationError(new z.ZodError([])),
			"Invalid Input for root: Invalid input",
		);
	});
});
