import type { BwfMatchSummary, BwfTournamentSummary } from "./types";

export const DEMO_TOURNAMENTS: BwfTournamentSummary[] = [
	{
		id: "5623",
		code: "F5C3AACA-CA45-47CE-A7B4-80B3A59329EB",
		name: "YONEX All England Open Badminton Championships 2026",
		categoryName: "Super 1000",
		date: "2026-03-10 - 2026-03-15",
		venueName: "Utilita Arena Birmingham (バーミンガム)",
		link: "https://bwfworldtour.bwfbadminton.com/",
		liveCount: 3,
		matchCount: 16,
	},
	{
		id: "5624",
		code: "97FF954D-0A47-498D-81D1-B9105D891B59",
		name: "DAIHATSU Japan Open 2026",
		categoryName: "Super 750",
		date: "2026-08-18 - 2026-08-23",
		venueName: "横浜アリーナ (横浜)",
		link: "https://bwfworldtour.bwfbadminton.com/",
		liveCount: 0,
		matchCount: 24,
	},
];

export const INITIAL_DEMO_MATCHES: BwfMatchSummary[] = [
	// 1. Live: Akane Yamaguchi vs An Se Young
	{
		id: "demo-live-1",
		code: "WS23",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "SF",
		displayRound: "準決勝",
		court: "Court 1",
		displayCourt: "第1コート",
		eventType: "live",
		statusLabel: "ライブ中",
		durationMinutes: 62,
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-akane",
						name: "山口茜",
						originalName: "Akane YAMAGUCHI",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "KOR",
				isJapanese: false,
				players: [
					{
						id: "p-anseyoung",
						name: "An Se Young",
						originalName: "An Se Young",
						countryCode: "KOR",
						isJapanese: false,
					},
				],
			},
		],
		scores: [
			{ game: 1, team1: 21, team2: 19 },
			{ game: 2, team1: 18, team2: 21 },
			{ game: 3, team1: 20, team2: 19, servingTeam: 1, lastPointWinner: 1 },
		],
		h2h: {
			team1Wins: 13,
			team2Wins: 14,
			previousMeeting: {
				tournament: "World Tour Finals 2025",
				round: "決勝",
				winner: 1,
				score: "21-17, 21-19",
			},
		},
	},

	// 2. Live: Hoki / Kobayashi vs Liang / Wang
	{
		id: "demo-live-2",
		code: "MD14",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "SF",
		displayRound: "準決勝",
		court: "Court 2",
		displayCourt: "第2コート",
		eventType: "live",
		statusLabel: "ライブ中",
		durationMinutes: 38,
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-hoki",
						name: "保木卓朗",
						originalName: "Takuro HOKI",
						countryCode: "JPN",
						isJapanese: true,
					},
					{
						id: "p-kobayashi",
						name: "小林優吾",
						originalName: "Yugo KOBAYASHI",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "CHN",
				isJapanese: false,
				players: [
					{
						id: "p-liang",
						name: "Liang Wei Keng",
						originalName: "Liang Wei Keng",
						countryCode: "CHN",
						isJapanese: false,
					},
					{
						id: "p-wang",
						name: "Wang Chang",
						originalName: "Wang Chang",
						countryCode: "CHN",
						isJapanese: false,
					},
				],
			},
		],
		scores: [
			{ game: 1, team1: 21, team2: 18 },
			{ game: 2, team1: 17, team2: 16, servingTeam: 2, lastPointWinner: 2 },
		],
		h2h: {
			team1Wins: 4,
			team2Wins: 5,
			previousMeeting: {
				tournament: "China Open 2025",
				round: "準決勝",
				winner: 2,
				score: "21-19, 18-21, 21-17",
			},
		},
	},

	// 3. Live: Kodai Naraoka vs Shi Yu Qi
	{
		id: "demo-live-3",
		code: "MS18",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "SF",
		displayRound: "準決勝",
		court: "Court 3",
		displayCourt: "第3コート",
		eventType: "live",
		statusLabel: "ライブ中",
		durationMinutes: 44,
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-naraoka",
						name: "奈良岡功大",
						originalName: "Kodai NARAOKA",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "CHN",
				isJapanese: false,
				players: [
					{
						id: "p-shiyuqi",
						name: "Shi Yu Qi",
						originalName: "Shi Yu Qi",
						countryCode: "CHN",
						isJapanese: false,
					},
				],
			},
		],
		scores: [
			{ game: 1, team1: 16, team2: 21 },
			{ game: 2, team1: 15, team2: 13, servingTeam: 1, lastPointWinner: 1 },
		],
		h2h: {
			team1Wins: 3,
			team2Wins: 6,
			previousMeeting: {
				tournament: "Malaysia Open 2026",
				round: "準々決勝",
				winner: 2,
				score: "21-18, 21-15",
			},
		},
	},

	// 4. Scheduled: Matsuyama / Shida vs Baek / Lee
	{
		id: "demo-sched-1",
		code: "WD08",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "SF",
		displayRound: "準決勝",
		court: "Court 1",
		displayCourt: "第1コート",
		eventType: "scheduled",
		statusLabel: "開始前",
		startTime: "2026-03-14T18:30:00+09:00",
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-matsuyama",
						name: "松山奈未",
						originalName: "Nami MATSUYAMA",
						countryCode: "JPN",
						isJapanese: true,
					},
					{
						id: "p-shida",
						name: "志田千陽",
						originalName: "Chiharu SHIDA",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "KOR",
				isJapanese: false,
				players: [
					{
						id: "p-baek",
						name: "Baek Ha Na",
						originalName: "Baek Ha Na",
						countryCode: "KOR",
						isJapanese: false,
					},
					{
						id: "p-lee",
						name: "Lee So Hee",
						originalName: "Lee So Hee",
						countryCode: "KOR",
						isJapanese: false,
					},
				],
			},
		],
		scores: [],
		h2h: {
			team1Wins: 6,
			team2Wins: 8,
			previousMeeting: {
				tournament: "Indonesia Open 2025",
				round: "決勝",
				winner: 1,
				score: "21-15, 21-18",
			},
		},
	},

	// 5. Scheduled: Kenta Nishimoto vs Viktor Axelsen
	{
		id: "demo-sched-2",
		code: "MS19",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "SF",
		displayRound: "準決勝",
		court: "Court 1",
		displayCourt: "第1コート",
		eventType: "scheduled",
		statusLabel: "開始前",
		startTime: "2026-03-14T19:30:00+09:00",
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-nishimoto",
						name: "西本拳太",
						originalName: "Kenta NISHIMOTO",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "DEN",
				isJapanese: false,
				players: [
					{
						id: "p-axelsen",
						name: "Viktor Axelsen",
						originalName: "Viktor AXELSEN",
						countryCode: "DEN",
						isJapanese: false,
					},
				],
			},
		],
		scores: [],
		h2h: {
			team1Wins: 2,
			team2Wins: 9,
		},
	},

	// 6. Scheduled: Tomoka Miyazaki vs Gregoria Mariska Tunjung
	{
		id: "demo-sched-3",
		code: "WS24",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "SF",
		displayRound: "準決勝",
		court: "Court 2",
		displayCourt: "第2コート",
		eventType: "scheduled",
		statusLabel: "開始前",
		startTime: "2026-03-14T20:15:00+09:00",
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-miyazaki",
						name: "宮崎友花",
						originalName: "Tomoka MIYAZAKI",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "INA",
				isJapanese: false,
				players: [
					{
						id: "p-tunjung",
						name: "Gregoria Mariska Tunjung",
						originalName: "Gregoria Mariska Tunjung",
						countryCode: "INA",
						isJapanese: false,
					},
				],
			},
		],
		scores: [],
		h2h: {
			team1Wins: 1,
			team2Wins: 2,
		},
	},

	// 7. Completed: Midorikawa / Saito vs Feng / Huang
	{
		id: "demo-comp-1",
		code: "XD12",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "QF",
		displayRound: "準々決勝",
		court: "Court 1",
		displayCourt: "第1コート",
		eventType: "completed",
		statusLabel: "試合終了",
		durationMinutes: 74,
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-midorikawa",
						name: "緑川大輝",
						originalName: "Hiroki MIDORIKAWA",
						countryCode: "JPN",
						isJapanese: true,
					},
					{
						id: "p-saito",
						name: "齋藤夏",
						originalName: "Natsu SAITO",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "CHN",
				isJapanese: false,
				players: [
					{
						id: "p-feng",
						name: "Feng Yan Zhe",
						originalName: "Feng Yan Zhe",
						countryCode: "CHN",
						isJapanese: false,
					},
					{
						id: "p-huang",
						name: "Huang Dong Ping",
						originalName: "Huang Dong Ping",
						countryCode: "CHN",
						isJapanese: false,
					},
				],
			},
		],
		scores: [
			{ game: 1, team1: 21, team2: 17 },
			{ game: 2, team1: 19, team2: 21 },
			{ game: 3, team1: 22, team2: 20 },
		],
		h2h: {
			team1Wins: 2,
			team2Wins: 4,
		},
	},

	// 8. Completed: Koki Watanabe vs Chou Tien Chen
	{
		id: "demo-comp-2",
		code: "MS12",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "QF",
		displayRound: "準々決勝",
		court: "Court 2",
		displayCourt: "第2コート",
		eventType: "completed",
		statusLabel: "試合終了",
		durationMinutes: 52,
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-watanabe-k",
						name: "渡邉航貴",
						originalName: "Koki WATANABE",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "TPE",
				isJapanese: false,
				players: [
					{
						id: "p-chou",
						name: "Chou Tien Chen",
						originalName: "Chou Tien Chen",
						countryCode: "TPE",
						isJapanese: false,
					},
				],
			},
		],
		scores: [
			{ game: 1, team1: 21, team2: 18 },
			{ game: 2, team1: 21, team2: 16 },
		],
		h2h: {
			team1Wins: 3,
			team2Wins: 2,
		},
	},

	// 9. Completed: Fukushima / Matsumoto vs Tan / Thinaah
	{
		id: "demo-comp-3",
		code: "WD06",
		tournamentId: "5623",
		tournamentName: "YONEX All England Open 2026",
		tournamentCategory: "Super 1000",
		round: "QF",
		displayRound: "準々決勝",
		court: "Court 3",
		displayCourt: "第3コート",
		eventType: "completed",
		statusLabel: "試合終了",
		durationMinutes: 58,
		hasJapanesePlayer: true,
		teams: [
			{
				countryCode: "JPN",
				isJapanese: true,
				players: [
					{
						id: "p-fukushima",
						name: "福島由紀",
						originalName: "Yuki FUKUSHIMA",
						countryCode: "JPN",
						isJapanese: true,
					},
					{
						id: "p-matsumoto",
						name: "松本麻佑",
						originalName: "Mayu MATSUMOTO",
						countryCode: "JPN",
						isJapanese: true,
					},
				],
			},
			{
				countryCode: "MAS",
				isJapanese: false,
				players: [
					{
						id: "p-tan",
						name: "Pearly Tan",
						originalName: "Pearly Tan",
						countryCode: "MAS",
						isJapanese: false,
					},
					{
						id: "p-thinaah",
						name: "Thinaah Muralitharan",
						originalName: "Thinaah Muralitharan",
						countryCode: "MAS",
						isJapanese: false,
					},
				],
			},
		],
		scores: [
			{ game: 1, team1: 21, team2: 19 },
			{ game: 2, team1: 21, team2: 18 },
		],
		h2h: {
			team1Wins: 3,
			team2Wins: 1,
		},
	},
];

// Mutates a copy of matches to simulate live rallies during auto-refresh
export function stepDemoLiveMatchScores(
	matches: BwfMatchSummary[],
): BwfMatchSummary[] {
	return matches.map((match) => {
		if (match.eventType !== "live" || match.scores.length === 0) {
			return match;
		}

		const scores = match.scores.map((s) => ({ ...s }));
		const currentIdx = scores.length - 1;
		const current = { ...scores[currentIdx] };

		// Random point winner between team 1 and 2
		const winner: 1 | 2 = Math.random() > 0.5 ? 1 : 2;
		if (winner === 1) {
			current.team1 += 1;
		} else {
			current.team2 += 1;
		}
		current.lastPointWinner = winner;
		current.servingTeam = winner;

		// Check if set is won
		const t1 = current.team1;
		const t2 = current.team2;
		const isWon =
			(t1 >= 21 && t1 - t2 >= 2) ||
			(t2 >= 21 && t2 - t1 >= 2) ||
			t1 === 30 ||
			t2 === 30;

		scores[currentIdx] = current;

		if (isWon && scores.length < 3) {
			scores.push({
				game: scores.length + 1,
				team1: 0,
				team2: 0,
				servingTeam: winner,
				lastPointWinner: winner,
			});
		}

		return {
			...match,
			scores,
			scoreChangedTeam: winner,
		};
	});
}
