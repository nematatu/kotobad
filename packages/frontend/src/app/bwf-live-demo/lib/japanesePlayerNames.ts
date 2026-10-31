// BWF nameDisplay -> Japanese display name.
export const JAPANESE_PLAYER_NAMES: Record<string, string> = {
	"ARISA IGARASHI": "五十嵐有紗",
	"AKANE YAMAGUCHI": "山口茜",
	"AKIRA KOGA": "古賀輝",
	"AMPO MUTSUKI": "安保武輝",
	"MUTSUKI AMPO": "安保武輝",
	"AYA OHORI": "大堀彩",
	"AYA TAMAKI": "玉木亜弥",
	"ARISA HIGASHINO": "東野有紗",
	"CHIHARU SHIDA": "志田千陽",
	"DAIKI NISHI": "西大輝",
	"DAISUKE SANO": "佐野大輔",
	"HIROKI MIDORIKAWA": "緑川大輝",
	"HIROKI OKAMURA": "岡村洋輝",
	"HINA OSAWA": "大澤陽奈",
	"HIKARU KOGA": "古賀輝",
	"KANTA TSUNEYAMA": "常山幹太",
	"KAORU SUGIYAMA": "杉山薫",
	"KENYA MITSUHASHI": "三橋健也",
	"KENTA NISHIMOTO": "西本拳太",
	"KENTO MOMOTA": "桃田賢斗",
	"KIE NAKANISHI": "中西貴映",
	"KOO TAKAHASHI": "高橋洸士",
	"KODAI NARAOKA": "奈良岡功大",
	"KOKI WATANABE": "渡邉航貴",
	"MANAMI SUIZU": "水津愛美",
	"MAYU MATSUMOTO": "松本麻佑",
	"MIKI KANEHIRO": "金廣美希",
	"NAMI MATSUYAMA": "松山奈未",
	"NATSU SAITO": "齋藤夏",
	"NAYU SHIRAKAWA": "白川菜結",
	"NODOKA SUNAKAWA": "砂川温香",
	"NOZOMI OKUHARA": "奥原希望",
	"RIKO GUNJI": "郡司莉子",
	"RIN IWANAGA": "岩永鈴",
	"RUI HIROKAMI": "廣上瑠依",
	"SAKURA MASUKI": "舛木さくら",
	"SAYAKA HOBARA": "保原彩夏",
	"SHO KUMAGAI": "熊谷翔",
	"TAKUMI NOMURA": "野村拓海",
	"TAKURO HOKI": "保木卓朗",
	"TOMOKA MIYAZAKI": "宮崎友花",
	"TOMONA HARIMA": "播摩朋奈",
	"TORI AIZAWA": "相澤桃李",
	"WAKANA NAGAHARA": "永原和可那",
	"YUGO KOBAYASHI": "小林優吾",
	"YUHO IMAI": "今井優歩",
	"YUICHI SHIMOGAMI": "霜上雄一",
	"YUKI FUKUSHIMA": "福島由紀",
	"YUNA KATO": "加藤佑奈",
	"YUSHI TANAKA": "田中湧士",
	"YUTA WATANABE": "渡辺勇大",
};

const ROMANIZED_NAMES_BY_JAPANESE = Object.entries(
	JAPANESE_PLAYER_NAMES,
).reduce<Map<string, string[]>>((names, [romanized, japanese]) => {
	const values = names.get(japanese) || [];
	if (!values.includes(romanized)) {
		values.push(romanized);
	}
	names.set(japanese, values);
	return names;
}, new Map());

function normalizeName(name: string): string {
	return name.trim().replace(/\s+/g, " ").toUpperCase();
}

export function japanesePlayerName(name: string): string | undefined {
	return JAPANESE_PLAYER_NAMES[normalizeName(name)];
}

export function isJapanesePlayer(
	name: string,
	countryCode?: string | null,
): boolean {
	if (countryCode && countryCode.toUpperCase() === "JPN") {
		return true;
	}
	return Boolean(japanesePlayerName(name));
}

export function japanesePlayerRomanizedNames(name: string): string[] {
	return ROMANIZED_NAMES_BY_JAPANESE.get(name.trim()) || [];
}
