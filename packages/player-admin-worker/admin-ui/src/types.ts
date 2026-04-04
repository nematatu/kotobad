export type Player = {
	id: number;
	firstName: string;
	lastName: string;
	firstFurigana: string;
	lastFurigana: string;
	englishFirstName: string;
	englishLastName: string;
	gender: "male" | "female" | null;
	imageUrl: string | null;
	birthPlace: string;
	birthDate: number | null;
};

export type PlayerPayload = {
	firstName: string;
	lastName: string;
	firstFurigana: string;
	lastFurigana: string;
	englishFirstName: string;
	englishLastName: string;
	gender: "male" | "female" | null;
	imageUrl: string | null;
	birthPlace: string;
	birthDate: string | null;
};

export type PlayerUpdatePayload = Partial<PlayerPayload>;

export type Career = {
	id: number;
	playerId: number;
	name: string;
	category: string;
	startYear: number | null;
	endYear: number | null;
};

export type CareerPayload = {
	name: string;
	category: string;
	startYear: number | null;
	endYear: number | null;
};

export type PlayerPagination = {
	limit: number;
	offset: number;
	count: number;
	total: number;
};

export type FetchPlayersResult = {
	players: Player[];
	pagination: PlayerPagination;
};
