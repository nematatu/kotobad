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
