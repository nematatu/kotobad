import { asc } from "drizzle-orm";
import { userFavoritePlayers } from "../../../../../drizzle/schema";
import type { AppEnvironment } from "../../../../types";

type UserRouteDb = AppEnvironment["Variables"]["db"];

export const findUserFavoritePlayers = async (
	db: UserRouteDb,
	userId: string,
) =>
	db.query.userFavoritePlayers.findMany({
		where: (table, { eq }) => eq(table.userId, userId),
		with: {
			player: {
				columns: {
					id: true,
					lastName: true,
					firstName: true,
					imageUrl: true,
				},
			},
		},
		orderBy: [asc(userFavoritePlayers.sortOrder)],
	});

type FavoritePlayersRows = Awaited<ReturnType<typeof findUserFavoritePlayers>>;

export const toFavoritePlayersResponse = (rows: FavoritePlayersRows) =>
	rows.flatMap((row) =>
		row.player
			? [
					{
						id: row.player.id,
						name: `${row.player.lastName} ${row.player.firstName}`,
						imageUrl: row.player.imageUrl ?? null,
					},
				]
			: [],
	);

export const hasSameNumberOrder = (a: number[], b: number[]) =>
	a.length === b.length && a.every((value, index) => b[index] === value);
