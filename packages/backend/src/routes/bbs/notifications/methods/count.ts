import { and, eq, isNull, sql } from "drizzle-orm";
import type { Context } from "hono";
import { notifications } from "../../../../../drizzle/schema";
import type { AppEnvironment } from "../../../../types";

export const getUnreadNotificationCount = async (
	c: Context<AppEnvironment>,
) => {
	try {
		const db = c.get("db");
		const user = c.get("betterAuthUser");

		const rows = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(notifications)
			.where(
				and(
					eq(notifications.recipientUserId, user.id),
					isNull(notifications.readAt),
				),
			);
		return c.json({ count: rows[0]?.count }, 200);
	} catch (e) {
		console.error(e);
	}
};
