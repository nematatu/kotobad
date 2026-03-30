export type Player = {
	id: number;
	firstName: string;
	lastName: string;
	firstFurigana: string;
	lastFurigana: string;
	englishFirstName: string;
	englishLastName: string;
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
	birthPlace: string;
	birthDate: string | null;
};
