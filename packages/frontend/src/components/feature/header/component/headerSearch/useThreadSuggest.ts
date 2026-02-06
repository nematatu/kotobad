"use client";

import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { HEADER_SEARCH_CONFIG } from "../../const/serach-config";

export type SuggestState = {
	items: ThreadType[];
	totalCount: number | null;
	loading: boolean;
};

type Options = {
	query: string;
};

export const useThreadSuggest = ({ query }: Options) => {
	const { MIN_QUERY_CHARS, SUGGEST_LIMIT, DEBOUNCE_MS } = HEADER_SEARCH_CONFIG;
	const [debouncedQuery, setDebouncedQuery] = useState(query.trim());

	useEffect(() => {
		const trimmed = query.trim();
		const handle = setTimeout(() => {
			setDebouncedQuery(trimmed);
		}, DEBOUNCE_MS);

		return () => clearTimeout(handle);
	}, [query]);

	const shouldFetch = debouncedQuery.length >= MIN_QUERY_CHARS;
	const swrKey = useMemo(
		() =>
			shouldFetch
				? (["SEARCH_THREADS", debouncedQuery, SUGGEST_LIMIT] as const)
				: null,
		[debouncedQuery, shouldFetch],
	);

	const { data, error, isValidating } = useSWR(
		swrKey,
		async ([_, q, limit]) => {
			const baseUrl = await getBffApiUrl("SEARCH_THREADS");
			const targetUrl = new URL(baseUrl);
			targetUrl.searchParams.set("q", q);
			targetUrl.searchParams.set("page", "1");
			targetUrl.searchParams.set("limit", String(limit));
			const res = await BffFetcher(targetUrl, { method: "GET" });
			const parsed = ThreadListSchema.parse(res);
			return {
				items: parsed.threads ?? [],
				totalCount: parsed.totalCount ?? 0,
			};
		},
		{
			revalidateOnFocus: false,
		},
	);

	const items = shouldFetch && !error ? (data?.items ?? []) : [];
	const totalCount =
		shouldFetch && !error ? (data?.totalCount ?? 0) : shouldFetch ? 0 : null;
	const loading = shouldFetch && isValidating && !data && !error;

	return { items, totalCount, loading };
};
