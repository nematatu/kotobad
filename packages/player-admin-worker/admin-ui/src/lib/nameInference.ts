import type { Player } from "../types";

type Gender = "male" | "female" | null;

export type InferredNameFields = {
	lastFurigana?: string;
	firstFurigana?: string;
	englishLastName?: string;
	englishFirstName?: string;
	gender?: Gender;
};

export type InferredSingleNameFields = {
	furigana: string;
	english?: string;
};

const KANA_ONLY_PATTERN = /^[ぁ-ゖァ-ヺー・\s]+$/u;

const normalize = (value: string) => value.trim();

const toKatakana = (value: string): string =>
	value
		.split("")
		.map((character) => {
			const code = character.charCodeAt(0);
			if (code >= 0x3041 && code <= 0x3096) {
				return String.fromCharCode(code + 0x60);
			}
			return character;
		})
		.join("");

const normalizeKana = (value: string): string | null => {
	const trimmed = normalize(value);
	if (trimmed.length === 0 || !KANA_ONLY_PATTERN.test(trimmed)) {
		return null;
	}
	return toKatakana(trimmed);
};

const HIRAGANA_DIGRAPH_MAP: Record<string, string> = {
	きゃ: "kya",
	きゅ: "kyu",
	きょ: "kyo",
	しゃ: "sha",
	しゅ: "shu",
	しょ: "sho",
	ちゃ: "cha",
	ちゅ: "chu",
	ちょ: "cho",
	にゃ: "nya",
	にゅ: "nyu",
	にょ: "nyo",
	ひゃ: "hya",
	ひゅ: "hyu",
	ひょ: "hyo",
	みゃ: "mya",
	みゅ: "myu",
	みょ: "myo",
	りゃ: "rya",
	りゅ: "ryu",
	りょ: "ryo",
	ぎゃ: "gya",
	ぎゅ: "gyu",
	ぎょ: "gyo",
	じゃ: "ja",
	じゅ: "ju",
	じょ: "jo",
	ぢゃ: "ja",
	ぢゅ: "ju",
	ぢょ: "jo",
	びゃ: "bya",
	びゅ: "byu",
	びょ: "byo",
	ぴゃ: "pya",
	ぴゅ: "pyu",
	ぴょ: "pyo",
	う゛ぁ: "va",
	う゛ぃ: "vi",
	う゛ぇ: "ve",
	う゛ぉ: "vo",
	てぃ: "ti",
	でぃ: "di",
	とぅ: "tu",
	どぅ: "du",
};

const HIRAGANA_MAP: Record<string, string> = {
	あ: "a",
	い: "i",
	う: "u",
	え: "e",
	お: "o",
	か: "ka",
	き: "ki",
	く: "ku",
	け: "ke",
	こ: "ko",
	さ: "sa",
	し: "shi",
	す: "su",
	せ: "se",
	そ: "so",
	た: "ta",
	ち: "chi",
	つ: "tsu",
	て: "te",
	と: "to",
	な: "na",
	に: "ni",
	ぬ: "nu",
	ね: "ne",
	の: "no",
	は: "ha",
	ひ: "hi",
	ふ: "fu",
	へ: "he",
	ほ: "ho",
	ま: "ma",
	み: "mi",
	む: "mu",
	め: "me",
	も: "mo",
	や: "ya",
	ゆ: "yu",
	よ: "yo",
	ら: "ra",
	り: "ri",
	る: "ru",
	れ: "re",
	ろ: "ro",
	わ: "wa",
	を: "wo",
	ん: "n",
	が: "ga",
	ぎ: "gi",
	ぐ: "gu",
	げ: "ge",
	ご: "go",
	ざ: "za",
	じ: "ji",
	ず: "zu",
	ぜ: "ze",
	ぞ: "zo",
	だ: "da",
	ぢ: "ji",
	づ: "zu",
	で: "de",
	ど: "do",
	ば: "ba",
	び: "bi",
	ぶ: "bu",
	べ: "be",
	ぼ: "bo",
	ぱ: "pa",
	ぴ: "pi",
	ぷ: "pu",
	ぺ: "pe",
	ぽ: "po",
	ぁ: "a",
	ぃ: "i",
	ぅ: "u",
	ぇ: "e",
	ぉ: "o",
	ゔ: "vu",
	ゎ: "wa",
	ー: "-",
	"・": " ",
};

const toHiragana = (value: string) =>
	value
		.split("")
		.map((character) => {
			const code = character.charCodeAt(0);
			if (code >= 0x30a1 && code <= 0x30f6) {
				return String.fromCharCode(code - 0x60);
			}
			return character;
		})
		.join("");

const duplicateConsonant = (romaji: string): string => {
	const matched = romaji.match(/^[bcdfghjklmnpqrstvwxyz]/);
	return matched ? matched[0] : "";
};

const findLastVowel = (text: string): string => {
	for (let index = text.length - 1; index >= 0; index -= 1) {
		const char = text[index];
		if (
			char === "a" ||
			char === "i" ||
			char === "u" ||
			char === "e" ||
			char === "o"
		) {
			return char;
		}
	}
	return "";
};

const katakanaToRomaji = (katakana: string): string | null => {
	const hiragana = toHiragana(katakana);
	let result = "";
	let index = 0;

	while (index < hiragana.length) {
		const current = hiragana[index];
		if (current === "っ") {
			const nextTwo = hiragana.slice(index + 1, index + 3);
			const nextOne = hiragana[index + 1] ?? "";
			const nextRomaji =
				HIRAGANA_DIGRAPH_MAP[nextTwo] ?? HIRAGANA_MAP[nextOne] ?? "";
			result += duplicateConsonant(nextRomaji);
			index += 1;
			continue;
		}
		if (current === "ー") {
			const vowel = findLastVowel(result);
			if (vowel.length > 0) {
				result += vowel;
			}
			index += 1;
			continue;
		}

		const digraph = hiragana.slice(index, index + 2);
		if (digraph.length === 2 && HIRAGANA_DIGRAPH_MAP[digraph]) {
			result += HIRAGANA_DIGRAPH_MAP[digraph];
			index += 2;
			continue;
		}

		const romaji = HIRAGANA_MAP[current];
		if (!romaji) {
			return null;
		}
		result += romaji;
		index += 1;
	}

	return result.replace(/-+/g, "").trim();
};

const toLowerCaseEnglish = (value: string | null): string | null => {
	if (!value) {
		return null;
	}
	return value.toLowerCase();
};

export const inferSingleNameByReading = (
	reading: string,
): InferredSingleNameFields | null => {
	const kana = normalizeKana(reading);
	if (!kana) {
		return null;
	}
	const romaji = katakanaToRomaji(kana);
	return {
		furigana: kana,
		english: toLowerCaseEnglish(romaji) ?? undefined,
	};
};

const inferByKana = (
	lastName: string,
	firstName: string,
): InferredNameFields => {
	const inferredLast = inferSingleNameByReading(lastName);
	const inferredFirst = inferSingleNameByReading(firstName);
	if (!inferredLast || !inferredFirst) {
		return {};
	}

	return {
		lastFurigana: inferredLast.furigana,
		firstFurigana: inferredFirst.furigana,
		englishLastName: inferredLast.english,
		englishFirstName: inferredFirst.english,
	};
};

export const inferNameFields = (
	lastName: string,
	firstName: string,
	players: Player[],
): InferredNameFields => {
	const normalizedLastName = normalize(lastName);
	const normalizedFirstName = normalize(firstName);
	if (normalizedLastName.length === 0 || normalizedFirstName.length === 0) {
		return {};
	}

	const matched = players.find(
		(player) =>
			normalize(player.lastName) === normalizedLastName &&
			normalize(player.firstName) === normalizedFirstName,
	);
	if (matched) {
		return {
			lastFurigana: matched.lastFurigana,
			firstFurigana: matched.firstFurigana,
			englishLastName: matched.englishLastName,
			englishFirstName: matched.englishFirstName,
			gender: matched.gender,
		};
	}

	return inferByKana(normalizedLastName, normalizedFirstName);
};
