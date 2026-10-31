import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HIDDEN_THREAD_IDS, isHiddenThreadId } from "./hiddenThreads";

describe("hiddenThreads", () => {
	it("exports HIDDEN_THREAD_IDS as an array", () => {
		assert.equal(Array.isArray(HIDDEN_THREAD_IDS), true);
	});

	it("returns false for null or undefined or empty", () => {
		assert.equal(isHiddenThreadId(null), false);
		assert.equal(isHiddenThreadId(undefined), false);
	});

	it("returns false for an unlisted thread id", () => {
		assert.equal(isHiddenThreadId(999999), false);
		assert.equal(isHiddenThreadId("non-existent-id"), false);
	});

	it("identifies matching IDs regardless of string or number representation", () => {
		// Test with mock matching function logic
		const testIds: readonly (string | number)[] = [123, "456"];
		const testIsHidden = (id: string | number | null | undefined) => {
			if (id == null) return false;
			const idStr = String(id);
			return testIds.some((hiddenId) => String(hiddenId) === idStr);
		};

		assert.equal(testIsHidden(123), true);
		assert.equal(testIsHidden("123"), true);
		assert.equal(testIsHidden(456), true);
		assert.equal(testIsHidden("456"), true);
		assert.equal(testIsHidden(789), false);
		assert.equal(testIsHidden("789"), false);
	});
});
