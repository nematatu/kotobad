import { findTextUrlMatches } from "./autoLinkUtils";

const YOUTUBE_HOST_PATTERN = /(^|\.)youtube\.com$|(^|\.)youtu\.be$/;
const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{6,}$/;

function parseYouTubeStartSeconds(raw: string | null): number | null {
	if (!raw) {
		return null;
	}
	if (/^\d+$/.test(raw)) {
		return Number(raw);
	}
	const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);
	if (!match) {
		return null;
	}
	const hours = Number(match[1] ?? "0");
	const minutes = Number(match[2] ?? "0");
	const seconds = Number(match[3] ?? "0");
	const total = hours * 3600 + minutes * 60 + seconds;
	return total > 0 ? total : null;
}

function getYouTubeVideoIdFromUrl(url: URL): string | null {
	const host = url.hostname.toLowerCase();
	const pathSegments = url.pathname.split("/").filter(Boolean);

	if (host === "youtu.be" || host.endsWith(".youtu.be")) {
		const videoId = pathSegments[0];
		if (!videoId) {
			return null;
		}
		return YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
	}

	if (!YOUTUBE_HOST_PATTERN.test(host)) {
		return null;
	}

	if (url.pathname === "/watch") {
		const videoId = url.searchParams.get("v");
		if (!videoId) {
			return null;
		}
		return YOUTUBE_VIDEO_ID_PATTERN.test(videoId) ? videoId : null;
	}

	if (pathSegments.length >= 2) {
		const [kind, id] = pathSegments;
		if (
			kind &&
			id &&
			(kind === "shorts" || kind === "embed" || kind === "live")
		) {
			return YOUTUBE_VIDEO_ID_PATTERN.test(id) ? id : null;
		}
	}

	return null;
}

export function normalizeYouTubeUrl(rawUrl: string): string | null {
	try {
		const parsedUrl = new URL(rawUrl);
		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			return null;
		}
		const videoId = getYouTubeVideoIdFromUrl(parsedUrl);
		if (!videoId) {
			return null;
		}
		const normalizedUrl = new URL("https://www.youtube.com/watch");
		normalizedUrl.searchParams.set("v", videoId);
		const startSeconds = parseYouTubeStartSeconds(
			parsedUrl.searchParams.get("t") ?? parsedUrl.searchParams.get("start"),
		);
		if (startSeconds && startSeconds > 0) {
			normalizedUrl.searchParams.set("start", String(startSeconds));
		}
		return normalizedUrl.toString();
	} catch {
		return null;
	}
}

export function collectYouTubeUrlsFromText(text: string): string[] {
	const urls = findTextUrlMatches(text)
		.map((match) => normalizeYouTubeUrl(match.url))
		.filter((value): value is string => value !== null);
	const uniqueUrls = new Set(urls);
	return [...uniqueUrls];
}

type YouTubeEmbedMeta = {
	videoId: string;
	startSeconds: number | null;
	embedUrl: string;
	thumbnailUrl: string;
};

export function toYouTubeEmbedMeta(url: string): YouTubeEmbedMeta | null {
	const normalizedUrl = normalizeYouTubeUrl(url);
	if (!normalizedUrl) {
		return null;
	}

	try {
		const parsedUrl = new URL(normalizedUrl);
		const videoId = parsedUrl.searchParams.get("v");
		if (!videoId || !YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
			return null;
		}

		const startRaw = parsedUrl.searchParams.get("start");
		const startSeconds =
			startRaw && /^\d+$/.test(startRaw) ? Number(startRaw) : null;

		const embedUrl = new URL(
			`https://www.youtube-nocookie.com/embed/${videoId}`,
		);
		embedUrl.searchParams.set("modestbranding", "1");
		embedUrl.searchParams.set("rel", "0");
		embedUrl.searchParams.set("playsinline", "1");
		if (startSeconds && startSeconds > 0) {
			embedUrl.searchParams.set("start", String(startSeconds));
		}

		return {
			videoId,
			startSeconds,
			embedUrl: embedUrl.toString(),
			thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
		};
	} catch {
		return null;
	}
}
