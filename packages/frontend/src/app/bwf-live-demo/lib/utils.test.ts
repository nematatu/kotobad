import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	displayCountry,
	displayCourt,
	displayRound,
	formatMatchTime,
	playerInitial,
} from "./utils";

describe("bwf utils", () => {
	it("formats rounds into Japanese", () => {
		assert.equal(displayRound("F"), "決勝");
		assert.equal(displayRound("Final"), "決勝");
		assert.equal(displayRound("SF"), "準決勝");
		assert.equal(displayRound("Semi-finals"), "準決勝");
		assert.equal(displayRound("QF"), "準々決勝");
		assert.equal(displayRound("R16"), "ベスト16");
		assert.equal(displayRound("R32"), "ベスト32");
		assert.equal(displayRound(null), "本戦");
	});

	it("formats courts into Japanese", () => {
		assert.equal(displayCourt("Court 1"), "第1コート");
		assert.equal(displayCourt("Court 2"), "第2コート");
		assert.equal(displayCourt("court 3"), "第3コート");
		assert.equal(displayCourt(null), "");
	});

	it("formats country names", () => {
		assert.equal(displayCountry("JPN"), "日本");
		assert.equal(displayCountry("CHN"), "中国");
		assert.equal(displayCountry("KOR"), "韓国");
		assert.equal(displayCountry("DEN"), "デンマーク");
		assert.equal(displayCountry("XYZ"), "XYZ");
		assert.equal(displayCountry(null), "国籍不明");
	});

	it("extracts player initials", () => {
		assert.equal(playerInitial("Akane Yamaguchi"), "AY");
		assert.equal(playerInitial("Viktor Axelsen"), "VA");
		assert.equal(playerInitial("山口茜"), "山口");
		assert.equal(playerInitial("志田千陽"), "志田");
		assert.equal(playerInitial(""), "?");
	});

	it("formats match times", () => {
		assert.equal(formatMatchTime(null), "時刻未定");
		assert.equal(
			formatMatchTime("2026-03-14T09:30:00Z").includes("18:30"),
			true,
		);
	});
});
