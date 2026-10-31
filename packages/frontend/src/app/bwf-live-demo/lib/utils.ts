const ROUND_LABELS: Record<string, string> = {
	F: "決勝",
	Final: "決勝",
	SF: "準決勝",
	"Semi-finals": "準決勝",
	Semifinals: "準決勝",
	QF: "準々決勝",
	"Quarter-finals": "準々決勝",
	Quarterfinals: "準々決勝",
	R16: "ベスト16",
	"Round of 16": "ベスト16",
	R32: "ベスト32",
	"Round of 32": "ベスト32",
	R64: "ベスト64",
	"Round of 64": "ベスト64",
};

const COUNTRY_NAMES: Record<string, string> = {
	JPN: "日本",
	CHN: "中国",
	KOR: "韓国",
	DEN: "デンマーク",
	INA: "インドネシア",
	MAS: "マレーシア",
	THA: "タイ",
	TPE: "チャイニーズ・タイペイ",
	IND: "インド",
	SGP: "シンガポール",
	FRA: "フランス",
	GER: "ドイツ",
	ENG: "イングランド",
	ESP: "スペイン",
	HKG: "香港",
};

export function displayRound(round?: string | null): string {
	if (!round) return "本戦";
	return ROUND_LABELS[round] || round;
}

export function displayCourt(court?: string | null): string {
	if (!court) return "";
	return court.replace(/Court\s*(\d+)/i, "第$1コート");
}

export function displayCountry(code?: string | null): string {
	if (!code) return "国籍不明";
	const upper = code.toUpperCase();
	return COUNTRY_NAMES[upper] || upper;
}

export function playerInitial(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) return "?";
	// Kanji or Japanese characters: return first 2 chars
	if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(trimmed)) {
		return trimmed.slice(0, 2);
	}
	const parts = trimmed.split(/\s+/);
	if (parts.length > 1) {
		return parts.map((p) => p.charAt(0).toUpperCase()).join("");
	}
	return trimmed.slice(0, 2).toUpperCase();
}

const FMT_DATETIME = new Intl.DateTimeFormat("ja-JP", {
	month: "numeric",
	day: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
	timeZone: "Asia/Tokyo",
});

const FMT_TIME = new Intl.DateTimeFormat("ja-JP", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
	timeZone: "Asia/Tokyo",
});

export function formatMatchTime(timeStr?: string | null): string {
	if (!timeStr) return "時刻未定";
	const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timeStr)
		? `${timeStr.replace(" ", "T")}Z`
		: timeStr;
	const date = new Date(normalized);
	if (Number.isNaN(date.getTime())) return timeStr;
	return FMT_TIME.format(date);
}

export function formatFullDateTime(timeStr?: string | null): string {
	if (!timeStr) return "";
	const date = new Date(timeStr);
	if (Number.isNaN(date.getTime())) return timeStr;
	return FMT_DATETIME.format(date);
}
