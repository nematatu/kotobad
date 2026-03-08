import { Hono } from "hono";
import { getThreadRoomStub } from "../../../realtime/thread-event";
import type { AppEnvironment } from "../../../types";

const realtimeRouter = new Hono<AppEnvironment>();

realtimeRouter.get("/threads/:threadId/ws", async (c): Promise<Response> => {
	const upgrade = c.req.raw.headers.get("Upgrade")?.toLowerCase();
	if (upgrade !== "websocket") {
		return c.text("Upgrade requiered.", 426);
	}

	const threadId = Number(c.req.param("threadId"));
	if (!Number.isInteger(threadId) || threadId <= 0) {
		return c.json({ error: "Invalid threadId" }, 400);
	}

	const stub = getThreadRoomStub(c.env, threadId);
	return await stub.fetch("https://thread-room.internal/ws", {
		headers: c.req.raw.headers,
	});
});

export default realtimeRouter;
