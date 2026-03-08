import { DurableObject } from "cloudflare:workers";
import type { ThreadEvent } from "./types";

export class ThreadRoom extends DurableObject {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		console.log("[do] request", {
			method: request.method,
			path: url.pathname,
			upgrade: request.headers.get("Upgrade"),
		});

		if (
			request.headers.get("Upgrade") === "websocket" &&
			url.pathname === "/ws"
		) {
			const pair = new WebSocketPair();
			const [client, server] = Object.values(pair);

			this.ctx.acceptWebSocket(server);
			console.log("[do] ws accepted", {
				path: url.pathname,
				connections: this.ctx.getWebSockets().length,
			});

			return new Response(null, {
				status: 101,
				webSocket: client,
			});
		}

		if (request.method === "POST" && url.pathname === "/publish") {
			const event = (await request.json()) as ThreadEvent;
			const payload = JSON.stringify(event);
			const sockets = this.ctx.getWebSockets();
			console.log("[do] publish", {
				threadId: event.threadId,
				postId: event.postId,
				connections: sockets.length,
			});

			for (const ws of sockets) {
				try {
					ws.send(payload);
				} catch {}
			}
			return new Response(null, { status: 204 });
		}
		return new Response("Not found", { status: 404 });
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string) {
		console.log("[do] ws close", {
			code,
			reason,
			connections: this.ctx.getWebSockets().length,
		});
		ws.close(code, reason);
	}
}
