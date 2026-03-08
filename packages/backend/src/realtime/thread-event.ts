import type { Bindings } from "../types";
import type { ThreadEvent } from "./types";

const roomName = (threadId: number) => `thread:${threadId}`;

export const getThreadRoomStub = (env: Bindings, threadId: number) => {
	const id = env.THREAD_ROOM.idFromName(roomName(threadId));
	return env.THREAD_ROOM.get(id);
};

export const publishThreadEvent = async (
	env: Bindings,
	event: ThreadEvent,
): Promise<void> => {
	const stub = getThreadRoomStub(env, event.threadId);
	await stub.fetch("https://example.com/publish", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(event),
	});
};
