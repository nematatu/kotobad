import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { createDb, ensurePlayersTable } from "../db/client";
import { players } from "../db/schema";
import type { AppEnv } from "../types";
import { parsePositiveInt } from "../utils/request";
import {
	createPlayerSchema,
	toBirthDateEpochSeconds,
	updatePlayerSchema,
} from "../validation/player";

export const playersRouter = new Hono<AppEnv>();

playersRouter.get("/", async (c) => {
	await ensurePlayersTable(c.env.DB);
	const db = createDb(c.env.DB);
	const limitQuery = c.req.query("limit");
	const offsetQuery = c.req.query("offset");

	const limit = limitQuery ? Number.parseInt(limitQuery, 10) : 50;
	const offset = offsetQuery ? Number.parseInt(offsetQuery, 10) : 0;

	if (
		!Number.isSafeInteger(limit) ||
		limit < 1 ||
		limit > 200 ||
		!Number.isSafeInteger(offset) ||
		offset < 0
	) {
		return c.json(
			{ error: "limit は 1-200、offset は 0 以上の整数で指定してください" },
			400,
		);
	}

	const rows = await db
		.select()
		.from(players)
		.orderBy(desc(players.id))
		.limit(limit)
		.offset(offset);

	return c.json({
		players: rows,
		pagination: {
			limit,
			offset,
			count: rows.length,
		},
	});
});

playersRouter.get("/:id", async (c) => {
	await ensurePlayersTable(c.env.DB);
	const db = createDb(c.env.DB);
	const id = parsePositiveInt(c.req.param("id"));
	if (!id) {
		return c.json({ error: "id は正の整数で指定してください" }, 400);
	}

	const row = await db.query.players.findFirst({
		where: eq(players.id, id),
	});

	if (!row) {
		return c.json({ error: "not_found" }, 404);
	}

	return c.json({ player: row });
});

playersRouter.post("/", async (c) => {
	await ensurePlayersTable(c.env.DB);
	const db = createDb(c.env.DB);
	const body = await c.req.json().catch(() => null);
	if (!body) {
		return c.json({ error: "invalid_json" }, 400);
	}

	const parsed = createPlayerSchema.safeParse(body);
	if (!parsed.success) {
		return c.json(
			{
				error: "validation_error",
				issues: parsed.error.issues,
			},
			400,
		);
	}

	const normalizedBirthDate = toBirthDateEpochSeconds(parsed.data.birthDate);
	if (!normalizedBirthDate.ok) {
		return c.json({ error: normalizedBirthDate.message }, 400);
	}

	const [created] = await db
		.insert(players)
		.values({
			firstName: parsed.data.firstName,
			lastName: parsed.data.lastName,
			firstFurigana: parsed.data.firstFurigana,
			lastFurigana: parsed.data.lastFurigana,
			englishFirstName: parsed.data.englishFirstName,
			englishLastName: parsed.data.englishLastName,
			birthPlace: parsed.data.birthPlace,
			birthDate: normalizedBirthDate.value,
		})
		.returning();

	return c.json({ player: created }, 201);
});

playersRouter.patch("/:id", async (c) => {
	await ensurePlayersTable(c.env.DB);
	const db = createDb(c.env.DB);
	const id = parsePositiveInt(c.req.param("id"));
	if (!id) {
		return c.json({ error: "id は正の整数で指定してください" }, 400);
	}

	const body = await c.req.json().catch(() => null);
	if (!body) {
		return c.json({ error: "invalid_json" }, 400);
	}

	const parsed = updatePlayerSchema.safeParse(body);
	if (!parsed.success) {
		return c.json(
			{
				error: "validation_error",
				issues: parsed.error.issues,
			},
			400,
		);
	}

	const nextValues: Partial<typeof players.$inferInsert> = {};

	if (parsed.data.firstName !== undefined) {
		nextValues.firstName = parsed.data.firstName;
	}
	if (parsed.data.lastName !== undefined) {
		nextValues.lastName = parsed.data.lastName;
	}
	if (parsed.data.firstFurigana !== undefined) {
		nextValues.firstFurigana = parsed.data.firstFurigana;
	}
	if (parsed.data.lastFurigana !== undefined) {
		nextValues.lastFurigana = parsed.data.lastFurigana;
	}
	if (parsed.data.englishFirstName !== undefined) {
		nextValues.englishFirstName = parsed.data.englishFirstName;
	}
	if (parsed.data.englishLastName !== undefined) {
		nextValues.englishLastName = parsed.data.englishLastName;
	}
	if (parsed.data.birthPlace !== undefined) {
		nextValues.birthPlace = parsed.data.birthPlace;
	}
	if (Object.hasOwn(parsed.data, "birthDate")) {
		const normalizedBirthDate = toBirthDateEpochSeconds(parsed.data.birthDate);
		if (!normalizedBirthDate.ok) {
			return c.json({ error: normalizedBirthDate.message }, 400);
		}
		nextValues.birthDate = normalizedBirthDate.value;
	}

	if (Object.keys(nextValues).length === 0) {
		return c.json({ error: "更新する項目がありません" }, 400);
	}

	const [updated] = await db
		.update(players)
		.set(nextValues)
		.where(eq(players.id, id))
		.returning();

	if (!updated) {
		return c.json({ error: "not_found" }, 404);
	}

	return c.json({ player: updated });
});
