import { z } from "zod";
import { DEMO_TOURNAMENTS, INITIAL_DEMO_MATCHES } from "./demoMatches";
import { isJapanesePlayer, japanesePlayerName } from "./japanesePlayerNames";
import type {
	BwfEventType,
	BwfGameScore,
	BwfMatchSummary,
	BwfPlayerSummary,
	BwfTeamSummary,
	BwfTournamentSummary,
} from "./types";
import { displayCourt, displayRound } from "./utils";

const BWF_MATCH_CENTER_BASE_URL =
	"https://extranet-lv.bwfbadminton.com/api/match-center";
const DEFAULT_TOURNAMENT_ID = "5623";

const PlayerSchema = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	fullName: z.string().optional(),
	name_display: z.string().optional(),
	nameShort: z.string().optional(),
	playerLink: z.string().optional(),
	avatar: z
		.object({
			thumbnailUrl: z.string().optional(),
			url_cloudinary: z.string().optional(),
		})
		.optional(),
});

const CountrySchema = z.object({
	custom_code: z.string().optional(),
	code: z.string().optional(),
	flag_url: z.string().optional(),
});

const EmptyArraySchema = z.array(z.unknown()).transform(() => null);
const NullablePlayerSchema = z
	.union([PlayerSchema, EmptyArraySchema, z.null()])
	.optional()
	.transform((value) => (value && !Array.isArray(value) ? value : null));
const NullableCountrySchema = z
	.union([CountrySchema, z.null()])
	.optional()
	.transform((value) => value ?? null);

const LiveDetailSchema = z.object({
	id: z.number(),
	match_id: z.union([z.string(), z.number()]).transform(String),
	match_state: z.string(),
	court_code: z.string().nullable().optional(),
	court_name: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	event: z.string().nullable().optional(),
	round: z.string().nullable().optional(),
	team1_g1_score: z.number().nullable().optional(),
	team1_g2_score: z.number().nullable().optional(),
	team1_g3_score: z.number().nullable().optional(),
	team2_g1_score: z.number().nullable().optional(),
	team2_g2_score: z.number().nullable().optional(),
	team2_g3_score: z.number().nullable().optional(),
	match_state_name: z.string().nullable().optional(),
	serving_team: z.union([z.number(), z.string()]).nullable().optional(),
});

const MatchDetailSchema = z.object({
	id: z.number(),
	code: z.union([z.string(), z.number()]).transform(String),
	t1p1_player_model: NullablePlayerSchema,
	t1p2_player_model: NullablePlayerSchema,
	t2p1_player_model: NullablePlayerSchema,
	t2p2_player_model: NullablePlayerSchema,
	t1p1country_model: NullableCountrySchema,
	t1p2country_model: NullableCountrySchema,
	t2p1country_model: NullableCountrySchema,
	t2p2country_model: NullableCountrySchema,
});

const LiveMatchItemSchema = z.object({
	live_detail: LiveDetailSchema,
	match_detail: MatchDetailSchema,
	live_count: z.number().optional(),
	match_count: z.number().optional(),
});

const BwfLiveMatchesResponseSchema = z.object({
	results: z.array(LiveMatchItemSchema),
});

const NullableStringFieldSchema = z
	.union([z.string(), z.null(), z.literal(false)])
	.optional()
	.transform((value) => (typeof value === "string" ? value : null));

const CurrentLiveTournamentSchema = z.object({
	id: z.number(),
	code: z.string(),
	name: z.string(),
	date: z.string().nullable().optional(),
	venue_name: z.string().nullable().optional(),
	tmtLink: NullableStringFieldSchema,
	tmtLogo: NullableStringFieldSchema,
	category_model: z
		.object({
			name: z.string(),
		})
		.nullable()
		.optional(),
});

const BwfCurrentLiveResponseSchema = z.object({
	results: z.array(CurrentLiveTournamentSchema),
});

type PlayerModel = z.infer<typeof PlayerSchema>;
type CountryModel = z.infer<typeof CountrySchema>;

export type BwfLiveFeedResult = {
	ok: boolean;
	isFallback: boolean;
	fetchedAt: string;
	tournaments: BwfTournamentSummary[];
	matches: BwfMatchSummary[];
	message?: string;
};

const normalizeBwfTournamentId = (value?: string) =>
	value && /^\d+$/.test(value) ? value : DEFAULT_TOURNAMENT_ID;

const buildBwfLiveMatchesUrl = (tournamentId?: string) => {
	const resolvedTournamentId = normalizeBwfTournamentId(tournamentId);
	const targetUrl = new URL(
		"vue-live-matches",
		`${BWF_MATCH_CENTER_BASE_URL}/`,
	);
	targetUrl.searchParams.set("tmtId", resolvedTournamentId);
	targetUrl.searchParams.set("tmtType", "0");
	return targetUrl;
};

const buildBwfCurrentLiveUrl = () =>
	new URL("vue-current-live", `${BWF_MATCH_CENTER_BASE_URL}/`);

function extractPlayer(
	playerModel?: PlayerModel | null,
	countryModel?: CountryModel | null,
): BwfPlayerSummary | null {
	if (!playerModel) return null;
	const originalName =
		playerModel.fullName ||
		playerModel.name_display ||
		playerModel.nameShort ||
		"Unknown Player";
	const countryCode =
		countryModel?.custom_code || countryModel?.code || undefined;
	const isJpn = isJapanesePlayer(originalName, countryCode);
	const kanji = isJpn ? japanesePlayerName(originalName) : undefined;

	return {
		id: playerModel.id ? String(playerModel.id) : undefined,
		name: kanji || originalName,
		originalName,
		countryCode: countryCode?.toUpperCase(),
		flagUrl: countryModel?.flag_url,
		photoUrl:
			playerModel.avatar?.thumbnailUrl || playerModel.avatar?.url_cloudinary,
		isJapanese: isJpn,
	};
}

function buildTeamSummary(
	p1Model?: PlayerModel | null,
	p2Model?: PlayerModel | null,
	c1Model?: CountryModel | null,
	c2Model?: CountryModel | null,
): BwfTeamSummary {
	const p1 = extractPlayer(p1Model, c1Model);
	const p2 = extractPlayer(p2Model, c2Model);
	const players: BwfPlayerSummary[] = [p1, p2].filter(
		(p): p is BwfPlayerSummary => p !== null,
	);

	if (players.length === 0) {
		players.push({
			name: "TBD",
			originalName: "TBD",
			isJapanese: false,
		});
	}

	const countryCode =
		c1Model?.custom_code ||
		c1Model?.code ||
		c2Model?.custom_code ||
		c2Model?.code;
	const isJapanese = players.some((p) => p.isJapanese);

	return {
		countryCode: countryCode?.toUpperCase(),
		flagUrl: c1Model?.flag_url || c2Model?.flag_url,
		isJapanese,
		players,
	};
}

function parseMatchEventType(
	matchState: string,
	scores: BwfGameScore[],
): BwfEventType {
	const state = matchState.toUpperCase();
	if (state === "P" || state === "LIVE" || state === "IN_PROGRESS") {
		// If 2 sets are already won, it's completed
		let t1Wins = 0;
		let t2Wins = 0;
		for (const s of scores) {
			if ((s.team1 >= 21 && s.team1 - s.team2 >= 2) || s.team1 === 30) {
				t1Wins += 1;
			} else if ((s.team2 >= 21 && s.team2 - s.team1 >= 2) || s.team2 === 30) {
				t2Wins += 1;
			}
		}
		if (t1Wins >= 2 || t2Wins >= 2) return "completed";
		return "live";
	}
	if (state === "F" || state === "C" || state === "FINISHED") {
		return "completed";
	}
	return "scheduled";
}

function extractScores(
	liveDetail: z.infer<typeof LiveDetailSchema>,
): BwfGameScore[] {
	const scores: BwfGameScore[] = [];
	const g1t1 = liveDetail.team1_g1_score;
	const g1t2 = liveDetail.team2_g1_score;
	const g2t1 = liveDetail.team1_g2_score;
	const g2t2 = liveDetail.team2_g2_score;
	const g3t1 = liveDetail.team1_g3_score;
	const g3t2 = liveDetail.team2_g3_score;

	const servingTeam =
		liveDetail.serving_team === 1 || liveDetail.serving_team === "1"
			? 1
			: liveDetail.serving_team === 2 || liveDetail.serving_team === "2"
				? 2
				: undefined;

	if (g1t1 != null || g1t2 != null) {
		scores.push({
			game: 1,
			team1: g1t1 ?? 0,
			team2: g1t2 ?? 0,
		});
	}
	if (g2t1 != null || g2t2 != null) {
		scores.push({
			game: 2,
			team1: g2t1 ?? 0,
			team2: g2t2 ?? 0,
		});
	}
	if (g3t1 != null || g3t2 != null) {
		scores.push({
			game: 3,
			team1: g3t1 ?? 0,
			team2: g3t2 ?? 0,
		});
	}

	if (scores.length > 0 && servingTeam) {
		scores[scores.length - 1].servingTeam = servingTeam;
	}

	return scores;
}

export async function fetchBwfLiveFeed(): Promise<BwfLiveFeedResult> {
	const now = new Date().toISOString();

	try {
		const liveTournamentsRes = await fetch(buildBwfCurrentLiveUrl(), {
			method: "GET",
			headers: {
				accept: "application/json,text/plain,*/*",
				"accept-language": "en-US,en;q=0.9",
				referer: "https://bwfbadminton.com/",
			},
			cache: "no-store",
		});

		if (!liveTournamentsRes.ok) {
			return {
				ok: true,
				isFallback: true,
				fetchedAt: now,
				tournaments: DEMO_TOURNAMENTS,
				matches: INITIAL_DEMO_MATCHES,
				message: `BWF公式APIへの接続が制限されているため、デモ用ライブデータを表示しています。(HTTP ${liveTournamentsRes.status})`,
			};
		}

		const rawTournaments = await liveTournamentsRes.json();
		const parsedTournaments =
			BwfCurrentLiveResponseSchema.safeParse(rawTournaments);

		if (
			!parsedTournaments.success ||
			parsedTournaments.data.results.length === 0
		) {
			return {
				ok: true,
				isFallback: true,
				fetchedAt: now,
				tournaments: DEMO_TOURNAMENTS,
				matches: INITIAL_DEMO_MATCHES,
				message:
					"現在進行中の公式大会がないため、デモ用ライブデータを表示しています。",
			};
		}

		const tournaments: BwfTournamentSummary[] = [];
		const allMatches: BwfMatchSummary[] = [];

		for (const t of parsedTournaments.data.results) {
			const tId = String(t.id);
			let matchesRes: Response;
			try {
				matchesRes = await fetch(buildBwfLiveMatchesUrl(tId), {
					method: "GET",
					headers: {
						accept: "application/json,text/plain,*/*",
						referer: "https://bwfbadminton.com/",
					},
					cache: "no-store",
				});
			} catch {
				continue;
			}

			if (!matchesRes.ok) continue;

			const rawMatches = await matchesRes.json();
			const parsedMatches = BwfLiveMatchesResponseSchema.safeParse(rawMatches);
			if (!parsedMatches.success) continue;

			const results = parsedMatches.data.results;
			const liveCount = results.filter(
				(r) => r.live_detail.match_state.toUpperCase() === "P",
			).length;

			tournaments.push({
				id: tId,
				code: t.code,
				name: t.name,
				categoryName: t.category_model?.name,
				date: t.date ?? undefined,
				venueName: t.venue_name ?? undefined,
				link: t.tmtLink ?? undefined,
				logoUrl: t.tmtLogo ?? undefined,
				liveCount,
				matchCount: results.length,
			});

			for (const item of results) {
				const team1 = buildTeamSummary(
					item.match_detail.t1p1_player_model,
					item.match_detail.t1p2_player_model,
					item.match_detail.t1p1country_model,
					item.match_detail.t1p2country_model,
				);
				const team2 = buildTeamSummary(
					item.match_detail.t2p1_player_model,
					item.match_detail.t2p2_player_model,
					item.match_detail.t2p1country_model,
					item.match_detail.t2p2country_model,
				);

				const scores = extractScores(item.live_detail);
				const eventType = parseMatchEventType(
					item.live_detail.match_state,
					scores,
				);
				const hasJapanesePlayer = team1.isJapanese || team2.isJapanese;

				allMatches.push({
					id: `${tId}-${item.live_detail.id}-${item.live_detail.match_id}`,
					code: item.match_detail.code,
					tournamentId: tId,
					tournamentName: t.name,
					tournamentCategory: t.category_model?.name,
					tournamentLogoUrl: t.tmtLogo ?? undefined,
					tournamentLink: t.tmtLink ?? undefined,
					teams: [team1, team2],
					scores,
					eventType,
					statusLabel:
						item.live_detail.match_state_name ||
						(eventType === "live"
							? "ライブ中"
							: eventType === "completed"
								? "試合終了"
								: "開始前"),
					round: item.live_detail.round ?? undefined,
					displayRound: displayRound(item.live_detail.round),
					court: item.live_detail.court_name ?? undefined,
					displayCourt: displayCourt(item.live_detail.court_name),
					durationMinutes: item.live_detail.duration ?? null,
					hasJapanesePlayer,
				});
			}
		}

		if (allMatches.length === 0) {
			return {
				ok: true,
				isFallback: true,
				fetchedAt: now,
				tournaments: DEMO_TOURNAMENTS,
				matches: INITIAL_DEMO_MATCHES,
				message:
					"現在取得可能な公式ライブ試合がありません。デモ用データを表示しています。",
			};
		}

		return {
			ok: true,
			isFallback: false,
			fetchedAt: now,
			tournaments: tournaments.length > 0 ? tournaments : DEMO_TOURNAMENTS,
			matches: allMatches,
		};
	} catch (error) {
		return {
			ok: true,
			isFallback: true,
			fetchedAt: now,
			tournaments: DEMO_TOURNAMENTS,
			matches: INITIAL_DEMO_MATCHES,
			message: `公式APIへの接続エラー (${error instanceof Error ? error.message : "ネットワーク障害"}) のため、デモ用データを表示しています。`,
		};
	}
}
