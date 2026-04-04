import { count, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { createDb } from "../db/client";
import { careers, players } from "../db/schema";
import type { AppEnv } from "../types";
import { parsePositiveInt } from "../utils/request";
import {
	createPlayerSchema,
	toBirthDateEpochSeconds,
	updatePlayerSchema,
} from "../validation/player";

export const playersRouter = new Hono<AppEnv>();
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/avif": "avif",
};

const toPublicImageUrl = (
	baseUrl: string,
	objectKey: string,
): { ok: true; imageUrl: string } | { ok: false; message: string } => {
	const trimmed = baseUrl.trim();
	if (trimmed.length === 0) {
		return { ok: false, message: "R2_PUBLIC_BASE_URL is empty" };
	}

	try {
		const base = new URL(trimmed.endsWith("/") ? trimmed : `${trimmed}/`);
		if (base.protocol !== "https:" && base.protocol !== "http:") {
			return {
				ok: false,
				message: "R2_PUBLIC_BASE_URL must use http or https scheme",
			};
		}
		return { ok: true, imageUrl: new URL(objectKey, base).toString() };
	} catch {
		return {
			ok: false,
			message: "R2_PUBLIC_BASE_URL must be an absolute URL",
		};
	}
};

const pickDefined = <T extends Record<string, unknown>>(input: T): Partial<T> =>
	Object.fromEntries(
		Object.entries(input).filter(([, value]) => value !== undefined),
	) as Partial<T>;

const careerCategoryValues = [
	"SJリーグ",
	"大学",
	"高校",
	"中学",
	"クラブ",
	"ジュニア",
] as const;

const careerItemSchema = z
	.object({
		name: z.string().trim().min(1).max(120),
		category: z.enum(careerCategoryValues),
		startYear: z.number().int().min(1900).max(2100).nullable().optional(),
		endYear: z.number().int().min(1900).max(2100).nullable().optional(),
	})
	.strict()
	.refine(
		(value) =>
			value.startYear == null ||
			value.endYear == null ||
			value.startYear <= value.endYear,
		{
			message: "startYear は endYear 以下で指定してください",
			path: ["startYear"],
		},
	);

const replaceCareersSchema = z
	.object({
		careers: z.array(careerItemSchema).max(60),
	})
	.strict();

playersRouter.get("/", async (c) => {
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
	const [{ total }] = await db.select({ total: count() }).from(players);

	return c.json({
		players: rows,
		pagination: {
			limit,
			offset,
			count: rows.length,
			total,
		},
	});
});

playersRouter.post("/upload-image", async (c) => {
	const publicBaseUrl = c.env.R2_PUBLIC_BASE_URL;
	if (!publicBaseUrl) {
		return c.json(
			{
				error: "server_misconfigured",
				message: "R2_PUBLIC_BASE_URL is not configured",
			},
			500,
		);
	}

	const formData = await c.req.formData();
	const fileEntry = formData.get("file");

	if (!(fileEntry instanceof File)) {
		return c.json({ error: "file is required" }, 400);
	}

	if (fileEntry.size <= 0) {
		return c.json({ error: "file is empty" }, 400);
	}

	if (fileEntry.size > MAX_IMAGE_BYTES) {
		return c.json({ error: "file size must be <= 8MB" }, 400);
	}

	const extension = MIME_TYPE_TO_EXTENSION[fileEntry.type];
	if (!extension) {
		return c.json({ error: "file type must be jpeg, png, webp, or avif" }, 400);
	}

	const objectKey = `player-image/${Date.now()}-${crypto.randomUUID()}.${extension}`;
	const fileBuffer = await fileEntry.arrayBuffer();
	await c.env.KOTOBAD_BUCKET.put(objectKey, fileBuffer, {
		httpMetadata: {
			contentType: fileEntry.type,
			cacheControl: "public, max-age=31536000, immutable",
		},
	});

	const imageUrl = toPublicImageUrl(publicBaseUrl, objectKey);
	if (!imageUrl.ok) {
		return c.json(
			{
				error: "server_misconfigured",
				message: imageUrl.message,
			},
			500,
		);
	}
	return c.json({ imageUrl: imageUrl.imageUrl }, 200);
});

playersRouter.get("/:id", async (c) => {
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

playersRouter.get("/:id/careers", async (c) => {
	const db = createDb(c.env.DB);
	const id = parsePositiveInt(c.req.param("id"));
	if (!id) {
		return c.json({ error: "id は正の整数で指定してください" }, 400);
	}

	const rows = await db
		.select()
		.from(careers)
		.where(eq(careers.playerId, id))
		.orderBy(desc(careers.startYear), desc(careers.endYear), desc(careers.id));

	return c.json({ careers: rows });
});

playersRouter.put("/:id/careers", async (c) => {
	const db = createDb(c.env.DB);
	const id = parsePositiveInt(c.req.param("id"));
	if (!id) {
		return c.json({ error: "id は正の整数で指定してください" }, 400);
	}

	const player = await db.query.players.findFirst({
		where: eq(players.id, id),
	});
	if (!player) {
		return c.json({ error: "not_found" }, 404);
	}

	const body = await c.req.json().catch(() => null);
	if (!body) {
		return c.json({ error: "invalid_json" }, 400);
	}

	const parsed = replaceCareersSchema.safeParse(body);
	if (!parsed.success) {
		return c.json(
			{
				error: "validation_error",
				issues: parsed.error.issues,
			},
			400,
		);
	}

	await db.delete(careers).where(eq(careers.playerId, id));

	if (parsed.data.careers.length > 0) {
		await db.insert(careers).values(
			parsed.data.careers.map((item) => ({
				playerId: id,
				name: item.name,
				category: item.category,
				startYear: item.startYear ?? null,
				endYear: item.endYear ?? null,
			})),
		);
	}

	const rows = await db
		.select()
		.from(careers)
		.where(eq(careers.playerId, id))
		.orderBy(desc(careers.startYear), desc(careers.endYear), desc(careers.id));

	return c.json({ careers: rows }, 200);
});

playersRouter.post("/", async (c) => {
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
			gender: parsed.data.gender ?? null,
			imageUrl: parsed.data.imageUrl ?? null,
			birthPlace: parsed.data.birthPlace,
			birthDate: normalizedBirthDate.value,
		})
		.returning();

	return c.json({ player: created }, 201);
});

playersRouter.patch("/:id", async (c) => {
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

	const nextValues: Partial<typeof players.$inferInsert> = pickDefined({
		firstName: parsed.data.firstName,
		lastName: parsed.data.lastName,
		firstFurigana: parsed.data.firstFurigana,
		lastFurigana: parsed.data.lastFurigana,
		englishFirstName: parsed.data.englishFirstName,
		englishLastName: parsed.data.englishLastName,
		gender: Object.hasOwn(parsed.data, "gender")
			? (parsed.data.gender ?? null)
			: undefined,
		imageUrl: Object.hasOwn(parsed.data, "imageUrl")
			? (parsed.data.imageUrl ?? null)
			: undefined,
		birthPlace: parsed.data.birthPlace,
	});

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
