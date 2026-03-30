import { useMemo, useState } from "react";
import { epochSecondsToDateInput } from "../lib/date";
import type { Player, PlayerPayload } from "../types";

type PlayerTableProps = {
	players: Player[];
	onSave: (id: number, payload: PlayerPayload) => Promise<void>;
};

const fieldKeys = [
	"lastName",
	"firstName",
	"lastFurigana",
	"firstFurigana",
	"englishLastName",
	"englishFirstName",
	"birthPlace",
] as const;

type EditableField = (typeof fieldKeys)[number];

const PlayerRow = ({
	player,
	onSave,
}: {
	player: Player;
	onSave: (id: number, payload: PlayerPayload) => Promise<void>;
}) => {
	const [isSaving, setIsSaving] = useState(false);
	const [fields, setFields] = useState<Omit<PlayerPayload, "birthDate">>({
		lastName: player.lastName,
		firstName: player.firstName,
		lastFurigana: player.lastFurigana,
		firstFurigana: player.firstFurigana,
		englishLastName: player.englishLastName,
		englishFirstName: player.englishFirstName,
		birthPlace: player.birthPlace,
	});
	const [birthDate, setBirthDate] = useState(
		epochSecondsToDateInput(player.birthDate),
	);

	const payload = useMemo<PlayerPayload>(
		() => ({
			...fields,
			birthDate: birthDate.trim().length > 0 ? birthDate : null,
		}),
		[birthDate, fields],
	);

	const handleFieldChange = (key: EditableField, value: string) => {
		setFields((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSaveClick = async () => {
		setIsSaving(true);
		try {
			await onSave(player.id, payload);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<tr>
			<td>{player.id}</td>
			<td>
				<input
					value={fields.lastName}
					onChange={(event) =>
						handleFieldChange("lastName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={fields.firstName}
					onChange={(event) =>
						handleFieldChange("firstName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={fields.lastFurigana}
					onChange={(event) =>
						handleFieldChange("lastFurigana", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={fields.firstFurigana}
					onChange={(event) =>
						handleFieldChange("firstFurigana", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={fields.englishLastName}
					onChange={(event) =>
						handleFieldChange("englishLastName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={fields.englishFirstName}
					onChange={(event) =>
						handleFieldChange("englishFirstName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={fields.birthPlace}
					onChange={(event) =>
						handleFieldChange("birthPlace", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					type="date"
					value={birthDate}
					onChange={(event) => setBirthDate(event.target.value)}
				/>
			</td>
			<td>
				<button
					type="button"
					className="ghost"
					disabled={isSaving}
					onClick={handleSaveClick}
				>
					{isSaving ? "保存中..." : "保存"}
				</button>
			</td>
		</tr>
	);
};

export const PlayerTable = ({ players, onSave }: PlayerTableProps) => {
	return (
		<section className="card">
			<h2>一覧 / 編集</h2>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>姓</th>
						<th>名</th>
						<th>姓フリガナ</th>
						<th>名フリガナ</th>
						<th>英字姓</th>
						<th>英字名</th>
						<th>出身地</th>
						<th>生年月日</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					{players.map((player) => (
						<PlayerRow key={player.id} player={player} onSave={onSave} />
					))}
				</tbody>
			</table>
		</section>
	);
};
