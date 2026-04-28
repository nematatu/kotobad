"use client";

import { ensureTrailingSlash } from "@kotobad/shared/src/utils/url/ensureTrailingSlash";
import { FRONTEND_BASE_URL } from "@/lib/api/url/BaseBffUrl";

type ShareIntentInput = {
	url: string;
	text?: string;
};

const getPublicFrontendOrigin = () => {
	if (typeof window !== "undefined") {
		return ensureTrailingSlash(window.location.origin);
	}

	return ensureTrailingSlash(FRONTEND_BASE_URL);
};

export const buildShareUrlFromPath = (pathname: string) => {
	const origin = getPublicFrontendOrigin();
	return new URL(pathname, origin).toString();
};

export const buildXShareIntentUrl = ({ url, text }: ShareIntentInput) => {
	const intentUrl = new URL("https://twitter.com/intent/tweet");
	intentUrl.searchParams.set("url", `${url}\n`);
	if (typeof text === "string" && text.length > 0) {
		intentUrl.searchParams.set("text", `${text}\n`);
	}

	intentUrl.searchParams.set("hashtags", "コトバド,kotobad");
	return intentUrl.toString();
};

export const buildLineShareIntentUrl = ({ url, text }: ShareIntentInput) => {
	const intentUrl = new URL("https://social-plugins.line.me/lineit/share");
	intentUrl.searchParams.set("url", url);
	if (typeof text === "string" && text.length > 0) {
		intentUrl.searchParams.set("text", text);
	}
	return intentUrl.toString();
};

export const copyTextToClipboard = async (value: string) => {
	if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
		return false;
	}
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
};
