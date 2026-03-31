import type { RouteHandler } from "@hono/zod-openapi";
import { createRoute, z } from "@hono/zod-openapi";
import { getErrorMessage } from "@kotobad/shared/src/utils/error/getErrorMessage";
import { asc, desc, like, or } from "drizzle-orm";
import { players } from "../../../../../drizzle/schema";
import { ErrorResponse } from "../../../../models/error";
import { OpenAPIUserProfileSelectablePlayersSchema } from "../../../../models/users";
import type { AppEnvironment } from "../../../../types";

const SortSchema = z
	.enum(["name_asc", "name_desc", "newest", "oldest"])
	.default("name_asc");

const findSelectablePlayers = async ({
	db,
	whereClause,
	sort,
	limit,
}: {
	db: AppEnvironment["Variables"]["db"];
	whereClause: ReturnType<typeof or> | undefined;
	sort: z.infer<typeof SortSchema>;
	limit: number;
}) =>
	db.query.players.findMany({
		columns: {
			id: true,
			firstName: true,
			lastName: true,
			first_furigana: true,
			last_furigana: true,
			englishFirstName: true,
			englishLastName: true,
			imageUrl: true,
		},
		where: whereClause,
		orderBy:
			sort === "newest"
				? [desc(players.id)]
				: sort === "oldest"
					? [asc(players.id)]
					: sort === "name_desc"
						? [desc(players.last_furigana), desc(players.first_furigana)]
						: [asc(players.last_furigana), asc(players.first_furigana)],
		limit,
	});

export const getProfileSelectablePlayersRoute = createRoute({
	method: "get",
	path: "/players",
	description: "プロフィール編集で使う選手一覧を取得",
	request: {
		query: z.object({
			q: z.string().trim().max(80).optional(),
			limit: z.coerce.number().int().min(1).max(500).default(300),
			sort: SortSchema,
		}),
	},
	responses: {
		200: {
			description: "選手一覧",
			content: {
				"application/json": {
					schema: OpenAPIUserProfileSelectablePlayersSchema,
				},
			},
		},
		500: {
			description: "サーバーエラー",
			content: {
				"application/json": {
					schema: ErrorResponse,
				},
			},
		},
	},
});

export const getProfileSelectablePlayersRouter: RouteHandler<
	typeof getProfileSelectablePlayersRoute,
	AppEnvironment
> = async (c) => {
	try {
		const db = c.get("db");
		const { q, limit, sort } = c.req.valid("query");
		const keyword = q?.trim() ?? "";
		const whereClause =
			keyword.length > 0
				? or(
						like(players.lastName, `%${keyword}%`),
						like(players.firstName, `%${keyword}%`),
						like(players.last_furigana, `%${keyword}%`),
						like(players.first_furigana, `%${keyword}%`),
						like(players.englishLastName, `%${keyword}%`),
						like(players.englishFirstName, `%${keyword}%`),
					)
				: undefined;

		const result = await findSelectablePlayers({
			db,
			whereClause,
			sort,
			limit,
		});

		return c.json(
			{
				players: result.map((item) => ({
					id: item.id,
					firstName: item.firstName,
					lastName: item.lastName,
					firstFurigana: item.first_furigana,
					lastFurigana: item.last_furigana,
					englishFirstName: item.englishFirstName,
					englishLastName: item.englishLastName,
					imageUrl: item.imageUrl ?? null,
				})),
			},
			200,
		);
	} catch (error: unknown) {
		console.error(error);
		return c.json(
			{
				error: "Failed to fetch profile selectable players",
				message: getErrorMessage(error),
			},
			500,
		);
	}
};
