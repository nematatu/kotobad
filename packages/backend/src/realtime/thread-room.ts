import { DurableObject } from "cloudflare:workers";
import type { ThreadEvent } from "./types";

export class ThreadRoom extends DurableObject {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (
			request.headers.get("Upgrade") === "websocket" &&
			url.pathname === "/ws"
		) {
			const pair = new WebSocketPair();
			const [client, server] = Object.values(pair);

			this.ctx.acceptWebSocket(server);

			return new Response(null, {
				status: 101,
				webSocket: client,
			});
		}

		if (request.method === "POST" && url.pathname === "/publish") {
			const event = (await request.json()) as ThreadEvent;
			const payload = JSON.stringify(event);

			for (const ws of this.ctx.getWebSockets()) {
				try {
					ws.send(payload);
				} catch {}
			}
			return new Response(null, { status: 204 });
		}
		return new Response("Not found", { status: 404 });
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string) {
		ws.close(code, reason);
	}
}
