import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	DEMO_TOURNAMENTS,
	INITIAL_DEMO_MATCHES,
	stepDemoLiveMatchScores,
} from "./demoMatches";

describe("demoMatches", () => {
	it("contains demo tournaments", () => {
		assert.equal(DEMO_TOURNAMENTS.length > 0, true);
		assert.equal(DEMO_TOURNAMENTS[0].name.includes("All England"), true);
	});

	it("contains initial demo matches for live, scheduled, and completed", () => {
		const liveMatches = INITIAL_DEMO_MATCHES.filter(
			(m) => m.eventType === "live",
		);
		const scheduledMatches = INITIAL_DEMO_MATCHES.filter(
			(m) => m.eventType === "scheduled",
		);
		const completedMatches = INITIAL_DEMO_MATCHES.filter(
			(m) => m.eventType === "completed",
		);

		assert.equal(liveMatches.length > 0, true);
		assert.equal(scheduledMatches.length > 0, true);
		assert.equal(completedMatches.length > 0, true);

		// Verify Japanese players are included
		assert.equal(
			liveMatches.some((m) => m.hasJapanesePlayer),
			true,
		);
	});

	it("steps scores forward for live matches", () => {
		const stepped = stepDemoLiveMatchScores(INITIAL_DEMO_MATCHES);
		const liveOriginal = INITIAL_DEMO_MATCHES.find(
			(m) => m.eventType === "live",
		);
		const liveStepped = stepped.find((m) => m.eventType === "live");

		assert.equal(liveOriginal != null, true);
		assert.equal(liveStepped != null, true);

		const origScore = liveOriginal?.scores.at(-1);
		const stepScore = liveStepped?.scores.at(-1);

		if (origScore && stepScore) {
			const origTotal = origScore.team1 + origScore.team2;
			const stepTotal = stepScore.team1 + stepScore.team2;
			assert.equal(
				stepTotal === origTotal + 1 ||
					liveStepped?.scores.length !== liveOriginal?.scores.length,
				true,
			);
		}
	});
});
