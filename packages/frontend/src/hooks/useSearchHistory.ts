"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
	query: string;
	at: number;
};

const STORAGE_KEY = "kotobad.searchHistory";

const normalizeHistory = (items: HistoryItem[], max: number) => {
	const seen = new Set<string>();
	const deduped: HistoryItem[] = [];
	for (const item of items) {
		const key = item.query.trim();
		if (!key || seen.has(key)) continue;
		seen.add(key);
		deduped.push({ query: key, at: item.at });
	}
	deduped.sort((a, b) => b.at - a.at);
	return deduped.slice(0, max);
};

const readHistory = () => {
	if (typeof window === "undefined") return [] as HistoryItem[];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as HistoryItem[];
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter((item) => typeof item?.query === "string")
			.map((item) => ({
				query: item.query,
				at: typeof item.at === "number" ? item.at : Date.now(),
			}));
	} catch {
		return [];
	}
};

const writeHistory = (items: HistoryItem[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const useSearchHistory = (max: number) => {
	const [items, setItems] = useState<HistoryItem[]>([]);

	useEffect(() => {
		const next = normalizeHistory(readHistory(), max);
		setItems(next);
		writeHistory(next);
	}, [max]);

	const add = (query: string) => {
		const trimmed = query.trim();
		if (!trimmed) return;
		setItems((prev) => {
			const next = normalizeHistory(
				[{ query: trimmed, at: Date.now() }, ...prev],
				max,
			);
			writeHistory(next);
			return next;
		});
	};

	const remove = (query: string) => {
		setItems((prev) => {
			const next = prev.filter((item) => item.query !== query);
			writeHistory(next);
			return next;
		});
	};

	const clear = () => {
		setItems([]);
		writeHistory([]);
	};

	return { items, add, remove, clear };
};
