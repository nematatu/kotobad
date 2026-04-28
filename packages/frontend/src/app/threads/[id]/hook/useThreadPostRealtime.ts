"use client";

import { useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/api/url/BaseUrl";

type ThreadEvent = {
	type: "post.created";
	threadId: number;
	postId: number;
};

const buildWsUrl = (threadId: number) => {
	const base = new URL(API_BASE_URL);
	base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
	base.pathname = `/bbs/realtime/threads/${threadId}/ws`;
	base.search = "";
	return base.toString();
};

export const useThreadPostRealtime = (
	threadId: number,
	onPostCreated: (postId: number) => void,
) => {
	const retryRef = useRef(0);

	useEffect(() => {
		let closed = false;
		let ws: WebSocket | null = null;
		let reconnectTimer: number | null = null;

		const connect = () => {
			if (closed) return;
			ws = new WebSocket(buildWsUrl(threadId));

			ws.onopen = () => {
				retryRef.current = 0;
			};

			ws.onmessage = (ev) => {
				try {
					const msg = JSON.parse(ev.data) as ThreadEvent;
					if (msg.type === "post.created" && msg.threadId === threadId) {
						onPostCreated(msg.postId);
					}
				} catch (error) {}
			};

			ws.onerror = () => ws?.close();
			ws.onclose = () => {
				if (closed) return;
				const wait = Math.min(1000 * 2 ** retryRef.current, 10000);
				retryRef.current += 1;
				reconnectTimer = window.setTimeout(connect, wait);
			};
		};

		connect();

		return () => {
			closed = true;
			if (reconnectTimer != null) window.clearTimeout(reconnectTimer);
			ws?.close();
		};
	}, [threadId, onPostCreated]);
};
