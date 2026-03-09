"use client";

import { ensureTrailingSlash } from "@kotobad/shared/src/utils/url/ensureTrailingSlash";
import { getClientOrigin } from "@/lib/api/url/clientOrigin";

const POST_SHARE_TEXT_MAX_LENGTH = 80;

type PostShareInput = {
	postId: number;
	threadTitle: string;
	postBody: string;
};

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const truncateText = (value: string, maxLength: number) => {
	if (value.length <= maxLength) {
		return value;
	}

	return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const getPublicFrontendOrigin = () => {
	const publicOrigin =
		process.env.NEXT_PUBLIC_FRONTEND_URL_PRODUCT ??
		process.env.NEXT_PUBLIC_FRONTEND_URL;

	if (publicOrigin) {
		return ensureTrailingSlash(publicOrigin);
	}

	return getClientOrigin();
};

export const buildPostShareUrl = ({
	postId,
}: Pick<PostShareInput, "postId">) => {
	const url = new URL(window.location.pathname, getPublicFrontendOrigin());
	url.searchParams.set("postId", String(postId));
	return url.toString();
};

export const buildPostShareText = ({
	threadTitle,
	postBody,
}: Omit<PostShareInput, "postId">) => {
	const normalizedThreadTitle = normalizeText(threadTitle);
	const normalizedPostBody = truncateText(
		normalizeText(postBody),
		POST_SHARE_TEXT_MAX_LENGTH,
	);

	if (!normalizedThreadTitle) {
		return normalizedPostBody;
	}

	if (!normalizedPostBody) {
		return normalizedThreadTitle;
	}

	return `${normalizedThreadTitle}\n${normalizedPostBody}\n`;
};

export const buildXShareUrl = (input: PostShareInput) => {
	const shareUrl = new URL("https://twitter.com/intent/tweet");
	shareUrl.searchParams.set("url", buildPostShareUrl(input));
	shareUrl.searchParams.set(
		"text",
		buildPostShareText({
			threadTitle: input.threadTitle,
			postBody: input.postBody,
		}),
	);
	return shareUrl.toString();
};

export const buildLineShareUrl = (input: PostShareInput) => {
	const shareUrl = new URL("https://social-plugins.line.me/lineit/share");
	shareUrl.searchParams.set("url", buildPostShareUrl(input));
	shareUrl.searchParams.set(
		"text",
		buildPostShareText({
			threadTitle: input.threadTitle,
			postBody: input.postBody,
		}),
	);
	return shareUrl.toString();
};
