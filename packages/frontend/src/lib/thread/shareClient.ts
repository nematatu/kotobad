"use client";

import { ensureTrailingSlash } from "@kotobad/shared/src/utils/url/ensureTrailingSlash";

type ShareIntentInput = {
	url: string;
	text?: string;
};

const getPublicFrontendOrigin = () => {
	const publicOrigin =
		process.env.NEXT_PUBLIC_FRONTEND_URL_PRODUCT ??
		process.env.NEXT_PUBLIC_FRONTEND_URL;

	if (publicOrigin) {
		return ensureTrailingSlash(publicOrigin);
	}

	if (typeof window !== "undefined") {
		return ensureTrailingSlash(window.location.origin);
	}

	return "";
};

export const buildShareUrlFromPath = (pathname: string) => {
	const origin = getPublicFrontendOrigin();
	if (!origin) {
		return pathname;
	}

	return new URL(pathname, origin).toString();
};

export const buildXShareIntentUrl = ({ url, text }: ShareIntentInput) => {
	const intentUrl = new URL("https://twitter.com/intent/tweet");
	intentUrl.searchParams.set("url", url + "\n");
	if (typeof text === "string" && text.length > 0) {
		intentUrl.searchParams.set("text", text + "\n");
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
