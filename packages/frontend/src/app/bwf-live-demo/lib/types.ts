export type BwfEventType = "live" | "scheduled" | "completed";

export type BwfPlayerSummary = {
	id?: string;
	name: string;
	originalName: string;
	countryCode?: string;
	flagUrl?: string;
	photoUrl?: string;
	isJapanese: boolean;
};

export type BwfTeamSummary = {
	countryCode?: string;
	flagUrl?: string;
	isJapanese: boolean;
	players: BwfPlayerSummary[];
};

export type BwfGameScore = {
	game: number;
	team1: number;
	team2: number;
	lastPointWinner?: 1 | 2;
	servingTeam?: 1 | 2;
};

export type BwfPreviousMeeting = {
	tournament: string;
	date?: string;
	round?: string;
	winner: 1 | 2;
	score: string;
};

export type BwfHeadToHead = {
	team1Wins: number;
	team2Wins: number;
	previousMeeting?: BwfPreviousMeeting;
};

export type BwfMatchSummary = {
	id: string;
	code?: string;
	tournamentId: string;
	tournamentName: string;
	tournamentCategory?: string;
	tournamentLogoUrl?: string;
	tournamentLink?: string;
	teams: [BwfTeamSummary, BwfTeamSummary];
	scores: BwfGameScore[];
	eventType: BwfEventType;
	statusLabel: string;
	round?: string;
	displayRound: string;
	court?: string;
	displayCourt: string;
	startTime?: string;
	durationMinutes?: number | null;
	hasJapanesePlayer: boolean;
	scoreChangedTeam?: 1 | 2;
	h2h?: BwfHeadToHead;
};

export type BwfTournamentSummary = {
	id: string;
	code: string;
	name: string;
	categoryName?: string;
	date?: string;
	venueName?: string;
	link?: string;
	logoUrl?: string;
	liveCount: number;
	matchCount: number;
};

export type BwfSortOrder = "court" | "time-asc" | "time-desc" | "tournament";
