import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	isJapanesePlayer,
	japanesePlayerName,
	japanesePlayerRomanizedNames,
} from "./japanesePlayerNames";

describe("japanesePlayerNames", () => {
	it("maps romanized name to Japanese display name", () => {
		assert.equal(japanesePlayerName("AKANE YAMAGUCHI"), "山口茜");
		assert.equal(japanesePlayerName("Akane Yamaguchi"), "山口茜");
		assert.equal(japanesePlayerName("akane yamaguchi"), "山口茜");
		assert.equal(japanesePlayerName("CHIHARU SHIDA"), "志田千陽");
		assert.equal(japanesePlayerName("KODAI NARAOKA"), "奈良岡功大");
		assert.equal(japanesePlayerName("TAKURO HOKI"), "保木卓朗");
		assert.equal(japanesePlayerName("YUGO KOBAYASHI"), "小林優吾");
	});

	it("returns undefined for non-Japanese or unknown players", () => {
		assert.equal(japanesePlayerName("AN SE YOUNG"), undefined);
		assert.equal(japanesePlayerName("VIKTOR AXELSEN"), undefined);
	});

	it("correctly identifies Japanese players", () => {
		assert.equal(isJapanesePlayer("Akane YAMAGUCHI"), true);
		assert.equal(isJapanesePlayer("Unknown Player", "JPN"), true);
		assert.equal(isJapanesePlayer("Unknown Player", "jpn"), true);
		assert.equal(isJapanesePlayer("An Se Young", "KOR"), false);
	});

	it("returns romanized names for Japanese name", () => {
		const romanized = japanesePlayerRomanizedNames("山口茜");
		assert.equal(romanized.includes("AKANE YAMAGUCHI"), true);
	});
});
