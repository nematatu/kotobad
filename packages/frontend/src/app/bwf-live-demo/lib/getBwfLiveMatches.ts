import { z } from "zod";

const BWF_MATCH_CENTER_BASE_URL =
	"https://extranet-lv.bwfbadminton.com/api/match-center";
const DEFAULT_TOURNAMENT_ID = "5623";

const PlayerSchema = z.object({
	fullName: z.string().optional(),
	name_display: z.string().optional(),
	nameShort: z.string().optional(),
	playerLink: z.string().optional(),
});

const CountrySchema = z.object({
	custom_code: z.string().optional(),
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
type NullablePlayerModel = PlayerModel | null;
type NullableCountryModel = CountryModel | null;

export type BwfLiveMatch = {
	liveId: number;
	matchId: string;
	code: string;
	status: string;
	statusLabel: string;
	courtCode: string | null;
	courtName: string | null;
	durationMinutes: number | null;
	event: string | null;
	round: string | null;
	team1Name: string;
	team2Name: string;
	team1Countries: string[];
	team2Countries: string[];
	team1PlayerLinks: string[];
	team2PlayerLinks: string[];
	games: Array<{
		label: string;
		team1: number | null;
		team2: number | null;
	}>;
};

export type BwfLiveMatchesResult =
	| {
			ok: true;
			tournamentId: string;
			fetchedAt: string;
			liveCount: number | null;
			matchCount: number | null;
			matches: BwfLiveMatch[];
	  }
	| {
			ok: false;
			tournamentId: string;
			reason: "request_failed" | "invalid_response";
			message: string;
	  };

export type BwfCurrentLiveTournament = {
	id: string;
	code: string;
	name: string;
	date: string | null;
	venueName: string | null;
	link: string | null;
	logoUrl: string | null;
	categoryName: string | null;
};

export type BwfLiveTournamentSection =
	| {
			ok: true;
			tournament: BwfCurrentLiveTournament;
			liveCount: number | null;
			matchCount: number | null;
			matches: BwfLiveMatch[];
	  }
	| {
			ok: false;
			tournament: BwfCurrentLiveTournament;
			message: string;
	  };

export type BwfCurrentLiveTournamentSectionsResult =
	| {
			ok: true;
			fetchedAt: string;
			tournaments: BwfLiveTournamentSection[];
	  }
	| {
			ok: false;
			reason: "request_failed" | "invalid_response";
			message: string;
	  };

export const normalizeBwfTournamentId = (value?: string) =>
	value && /^\d+$/.test(value) ? value : DEFAULT_TOURNAMENT_ID;

export const buildBwfLiveMatchesUrl = (tournamentId?: string) => {
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

const getPlayerName = (player?: NullablePlayerModel) =>
	player?.fullName ?? player?.name_display ?? player?.nameShort ?? null;

const getTeamName = (
	primary?: NullablePlayerModel,
	secondary?: NullablePlayerModel,
) => {
	const names = [getPlayerName(primary), getPlayerName(secondary)].filter(
		(name): name is string => Boolean(name),
	);

	if (names.length === 0) {
		return "TBD";
	}

	return names.join(" / ");
};

const getPlayerLinks = (
	primary?: NullablePlayerModel,
	secondary?: NullablePlayerModel,
) =>
	[primary?.playerLink, secondary?.playerLink].filter((link): link is string =>
		Boolean(link),
	);

const getCountryCodes = (
	primary?: NullableCountryModel,
	secondary?: NullableCountryModel,
) =>
	Array.from(
		new Set(
			[primary?.custom_code, secondary?.custom_code].filter(
				(code): code is string => Boolean(code),
			),
		),
	);

const getGames = (liveDetail: z.infer<typeof LiveDetailSchema>) =>
	[
		{
			label: "G1",
			team1: liveDetail.team1_g1_score ?? null,
			team2: liveDetail.team2_g1_score ?? null,
		},
		{
			label: "G2",
			team1: liveDetail.team1_g2_score ?? null,
			team2: liveDetail.team2_g2_score ?? null,
		},
		{
			label: "G3",
			team1: liveDetail.team1_g3_score ?? null,
			team2: liveDetail.team2_g3_score ?? null,
		},
	].filter((game) => game.team1 !== null || game.team2 !== null);

const toSortValue = (value: string | null | undefined) => {
	if (!value) {
		return Number.MAX_SAFE_INTEGER;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
};

const toTournamentSummary = (
	tournament: z.infer<typeof CurrentLiveTournamentSchema>,
): BwfCurrentLiveTournament => ({
	id: String(tournament.id),
	code: tournament.code,
	name: tournament.name,
	date: tournament.date ?? null,
	venueName: tournament.venue_name ?? null,
	link: tournament.tmtLink ?? null,
	logoUrl: tournament.tmtLogo ?? null,
	categoryName: tournament.category_model?.name ?? null,
});

export async function getBwfLiveMatches(
	tournamentId?: string,
): Promise<BwfLiveMatchesResult> {
	const resolvedTournamentId = normalizeBwfTournamentId(tournamentId);
	const targetUrl = buildBwfLiveMatchesUrl(resolvedTournamentId);

	let response: Response;
	try {
		response = await fetch(targetUrl, {
			method: "GET",
			headers: {
				accept: "application/json",
			},
			cache: "no-store",
		});
	} catch (error) {
		return {
			ok: false,
			tournamentId: resolvedTournamentId,
			reason: "request_failed",
			message:
				error instanceof Error
					? error.message
					: "BWF 公式 live matches API への接続に失敗しました。",
		};
	}

	if (!response.ok) {
		return {
			ok: false,
			tournamentId: resolvedTournamentId,
			reason: "request_failed",
			message: `BWF 公式 live matches API の取得に失敗しました (HTTP ${response.status})。`,
		};
	}

	const raw = await response.json();
	const parsed = BwfLiveMatchesResponseSchema.safeParse(raw);

	if (!parsed.success) {
		return {
			ok: false,
			tournamentId: resolvedTournamentId,
			reason: "invalid_response",
			message: "BWF 公式 live matches API の返却形式が想定と異なります。",
		};
	}

	const matches = parsed.data.results
		.map((item) => ({
			liveId: item.live_detail.id,
			matchId: item.live_detail.match_id,
			code: item.match_detail.code,
			status: item.live_detail.match_state,
			statusLabel:
				item.live_detail.match_state_name ?? item.live_detail.match_state,
			courtCode: item.live_detail.court_code ?? null,
			courtName: item.live_detail.court_name ?? null,
			durationMinutes: item.live_detail.duration ?? null,
			event: item.live_detail.event ?? null,
			round: item.live_detail.round ?? null,
			team1Name: getTeamName(
				item.match_detail.t1p1_player_model,
				item.match_detail.t1p2_player_model,
			),
			team2Name: getTeamName(
				item.match_detail.t2p1_player_model,
				item.match_detail.t2p2_player_model,
			),
			team1Countries: getCountryCodes(
				item.match_detail.t1p1country_model,
				item.match_detail.t1p2country_model,
			),
			team2Countries: getCountryCodes(
				item.match_detail.t2p1country_model,
				item.match_detail.t2p2country_model,
			),
			team1PlayerLinks: getPlayerLinks(
				item.match_detail.t1p1_player_model,
				item.match_detail.t1p2_player_model,
			),
			team2PlayerLinks: getPlayerLinks(
				item.match_detail.t2p1_player_model,
				item.match_detail.t2p2_player_model,
			),
			games: getGames(item.live_detail),
		}))
		.sort((a, b) => {
			const courtDiff = toSortValue(a.courtCode) - toSortValue(b.courtCode);
			if (courtDiff !== 0) {
				return courtDiff;
			}

			return Number(a.matchId) - Number(b.matchId);
		});

	const first = parsed.data.results.at(0);

	return {
		ok: true,
		tournamentId: resolvedTournamentId,
		fetchedAt: new Date().toISOString(),
		liveCount: first?.live_count ?? null,
		matchCount: first?.match_count ?? null,
		matches,
	};
}

export async function getBwfCurrentLiveTournaments(): Promise<BwfCurrentLiveTournamentSectionsResult> {
	let response: Response;
	try {
		response = await fetch(buildBwfCurrentLiveUrl(), {
			method: "GET",
			headers: {
				accept: "application/json",
			},
			cache: "no-store",
		});
	} catch (error) {
		return {
			ok: false,
			reason: "request_failed",
			message:
				error instanceof Error
					? error.message
					: "BWF 公式 current live API への接続に失敗しました。",
		};
	}

	if (!response.ok) {
		return {
			ok: false,
			reason: "request_failed",
			message: `BWF 公式 current live API の取得に失敗しました (HTTP ${response.status})。`,
		};
	}

	const raw = await response.json();
	const parsed = BwfCurrentLiveResponseSchema.safeParse(raw);

	if (!parsed.success) {
		return {
			ok: false,
			reason: "invalid_response",
			message: "BWF 公式 current live API の返却形式が想定と異なります。",
		};
	}

	const sections = await Promise.all(
		parsed.data.results.map(async (tournament) => {
			const summary = toTournamentSummary(tournament);
			const liveMatches = await getBwfLiveMatches(summary.id);

			if (!liveMatches.ok) {
				return {
					ok: false,
					tournament: summary,
					message: liveMatches.message,
				} satisfies BwfLiveTournamentSection;
			}

			return {
				ok: true,
				tournament: summary,
				liveCount: liveMatches.liveCount,
				matchCount: liveMatches.matchCount,
				matches: liveMatches.matches,
			} satisfies BwfLiveTournamentSection;
		}),
	);

	return {
		ok: true,
		fetchedAt: new Date().toISOString(),
		tournaments: sections,
	};
}
