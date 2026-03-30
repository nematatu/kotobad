import { useEffect, useMemo, useState } from "react";
import { uploadPlayerImage } from "../lib/api";
import { epochSecondsToDateInput } from "../lib/date";
import { buildPrefectureOptions } from "../lib/prefectures";
import type { Player, PlayerPayload } from "../types";
import { GenderToggleButtons } from "./GenderToggleButtons";

type PlayerTableProps = {
	token: string;
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
	"gender",
	"imageUrl",
	"birthPlace",
] as const;

type EditableField = (typeof fieldKeys)[number];
type GenderFilter = "all" | "male" | "female";

const normalize = (value: string) => value.trim().toLowerCase();

const toPlayerDraft = (player: Player): PlayerPayload => ({
	lastName: player.lastName,
	firstName: player.firstName,
	lastFurigana: player.lastFurigana,
	firstFurigana: player.firstFurigana,
	englishLastName: player.englishLastName,
	englishFirstName: player.englishFirstName,
	gender: player.gender,
	imageUrl: player.imageUrl,
	birthPlace: player.birthPlace,
	birthDate: epochSecondsToDateInput(player.birthDate) || null,
});

const isSameDraft = (left: PlayerPayload, right: PlayerPayload) =>
	left.lastName === right.lastName &&
	left.firstName === right.firstName &&
	left.lastFurigana === right.lastFurigana &&
	left.firstFurigana === right.firstFurigana &&
	left.englishLastName === right.englishLastName &&
	left.englishFirstName === right.englishFirstName &&
	left.gender === right.gender &&
	left.imageUrl === right.imageUrl &&
	left.birthPlace === right.birthPlace &&
	left.birthDate === right.birthDate;

const buildSearchTarget = (draft: PlayerPayload) =>
	[
		draft.lastName,
		draft.firstName,
		draft.lastFurigana,
		draft.firstFurigana,
		draft.englishLastName,
		draft.englishFirstName,
	]
		.join(" ")
		.toLowerCase();

const PlayerRow = ({
	playerId,
	token,
	draft,
	onDraftFieldChange,
	onDraftBirthDateChange,
}: {
	playerId: number;
	token: string;
	draft: PlayerPayload;
	onDraftFieldChange: (id: number, key: EditableField, value: string) => void;
	onDraftBirthDateChange: (id: number, value: string) => void;
}) => {
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const birthPlaceOptions = useMemo(
		() => buildPrefectureOptions(draft.birthPlace),
		[draft.birthPlace],
	);

	useEffect(() => {
		if (!isPreviewOpen) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsPreviewOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [isPreviewOpen]);

	const handleImageChange = async (file: File | null) => {
		if (!file) {
			return;
		}
		if (token.trim().length === 0) {
			setImageUploadError("先に管理トークンを入力してください");
			return;
		}

		setImageUploadError("");
		setIsUploadingImage(true);
		try {
			const uploadedImageUrl = await uploadPlayerImage(token, file);
			onDraftFieldChange(playerId, "imageUrl", uploadedImageUrl);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setImageUploadError(message);
		} finally {
			setIsUploadingImage(false);
		}
	};

	return (
		<tr>
			<td>
				{draft.imageUrl ? (
					<button
						type="button"
						className="player-preview player-preview-trigger"
						aria-label="画像を拡大表示"
						onClick={() => setIsPreviewOpen(true)}
					>
						<img
							src={draft.imageUrl}
							alt={`${draft.lastName}${draft.firstName}`}
						/>
						<div className="player-preview-name">
							<p>{draft.lastName + draft.firstName}</p>
							<p>
								{`${draft.englishLastName} ${draft.englishFirstName}`.trim()}
							</p>
						</div>
					</button>
				) : (
					<div className="player-preview">
						<div className="player-preview-empty">No Image</div>
						<div className="player-preview-name">
							<p>{draft.lastName + draft.firstName}</p>
							<p>
								{`${draft.englishLastName} ${draft.englishFirstName}`.trim()}
							</p>
						</div>
					</div>
				)}
				{isPreviewOpen && draft.imageUrl ? (
					<div
						className="image-lightbox"
						role="dialog"
						aria-label="画像プレビュー"
						aria-modal="true"
					>
						<button
							type="button"
							className="image-lightbox-backdrop"
							aria-label="画像プレビューを閉じる"
							onClick={() => setIsPreviewOpen(false)}
						/>
						<div className="image-lightbox-content">
							<button
								type="button"
								className="image-lightbox-close"
								onClick={() => setIsPreviewOpen(false)}
							>
								閉じる
							</button>
							<img
								src={draft.imageUrl}
								alt={`${draft.lastName}${draft.firstName}`}
							/>
						</div>
					</div>
				) : null}
			</td>
			<td>{playerId}</td>
			<td>
				<input
					value={draft.lastName}
					onChange={(event) =>
						onDraftFieldChange(playerId, "lastName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={draft.firstName}
					onChange={(event) =>
						onDraftFieldChange(playerId, "firstName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={draft.lastFurigana}
					onChange={(event) =>
						onDraftFieldChange(playerId, "lastFurigana", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={draft.firstFurigana}
					onChange={(event) =>
						onDraftFieldChange(playerId, "firstFurigana", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={draft.englishLastName}
					onChange={(event) =>
						onDraftFieldChange(playerId, "englishLastName", event.target.value)
					}
				/>
			</td>
			<td>
				<input
					value={draft.englishFirstName}
					onChange={(event) =>
						onDraftFieldChange(playerId, "englishFirstName", event.target.value)
					}
				/>
			</td>
			<td className="gender-cell">
				<GenderToggleButtons
					value={draft.gender}
					onChange={(value) =>
						onDraftFieldChange(playerId, "gender", value ?? "")
					}
				/>
			</td>
			<td>
				<div style={{ display: "grid", gap: "6px", minWidth: "210px" }}>
					<input
						type="file"
						accept="image/jpeg,image/png,image/webp,image/avif"
						onChange={(event) =>
							void handleImageChange(event.target.files?.[0] ?? null)
						}
					/>
					<input type="url" value={draft.imageUrl ?? ""} readOnly />
					{isUploadingImage ? (
						<span className="small">アップロード中...</span>
					) : null}
					{imageUploadError.length > 0 ? (
						<span className="small">失敗: {imageUploadError}</span>
					) : null}
				</div>
			</td>
			<td>
				<select
					value={draft.birthPlace}
					onChange={(event) =>
						onDraftFieldChange(playerId, "birthPlace", event.target.value)
					}
				>
					{birthPlaceOptions.map((prefecture) => (
						<option key={prefecture} value={prefecture}>
							{prefecture}
						</option>
					))}
				</select>
			</td>
			<td>
				<input
					type="date"
					value={draft.birthDate ?? ""}
					onChange={(event) =>
						onDraftBirthDateChange(playerId, event.target.value)
					}
				/>
			</td>
		</tr>
	);
};

export const PlayerTable = ({ token, players, onSave }: PlayerTableProps) => {
	const [nameQuery, setNameQuery] = useState("");
	const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
	const [draftsById, setDraftsById] = useState<Record<number, PlayerPayload>>(
		{},
	);
	const [baselineById, setBaselineById] = useState<
		Record<number, PlayerPayload>
	>({});
	const [isSavingAll, setIsSavingAll] = useState(false);
	const [saveMessage, setSaveMessage] = useState("");

	useEffect(() => {
		const nextEntries = players.map(
			(player) => [player.id, toPlayerDraft(player)] as const,
		);
		const nextState = Object.fromEntries(nextEntries) as Record<
			number,
			PlayerPayload
		>;
		setDraftsById(nextState);
		setBaselineById(nextState);
	}, [players]);

	const getDraftById = (id: number): PlayerPayload | null =>
		draftsById[id] ?? baselineById[id] ?? null;

	const handleDraftFieldChange = (
		id: number,
		key: EditableField,
		value: string,
	) => {
		setDraftsById((prev) => {
			const current = prev[id] ?? baselineById[id];
			if (!current) {
				return prev;
			}
			return {
				...prev,
				[id]: {
					...current,
					[key]:
						key === "gender" || key === "imageUrl"
							? value.trim().length > 0
								? value
								: null
							: value,
				},
			};
		});
	};

	const handleDraftBirthDateChange = (id: number, value: string) => {
		setDraftsById((prev) => {
			const current = prev[id] ?? baselineById[id];
			if (!current) {
				return prev;
			}
			return {
				...prev,
				[id]: {
					...current,
					birthDate: value.trim().length > 0 ? value : null,
				},
			};
		});
	};

	const dirtyIds = useMemo(
		() =>
			players
				.map((player) => player.id)
				.filter((id) => {
					const draft = draftsById[id] ?? baselineById[id] ?? null;
					const baseline = baselineById[id];
					if (!draft || !baseline) {
						return false;
					}
					return !isSameDraft(draft, baseline);
				}),
		[players, draftsById, baselineById],
	);

	const handleSaveAll = async () => {
		if (dirtyIds.length === 0 || isSavingAll) {
			return;
		}

		setIsSavingAll(true);
		setSaveMessage("");
		let currentId: number | null = null;
		try {
			for (const id of dirtyIds) {
				currentId = id;
				const draft = getDraftById(id);
				if (!draft) {
					continue;
				}
				await onSave(id, draft);
			}
			setBaselineById((prev) => {
				const next = { ...prev };
				for (const id of dirtyIds) {
					const draft = getDraftById(id);
					if (draft) {
						next[id] = { ...draft };
					}
				}
				return next;
			});
			setSaveMessage(`保存完了: ${dirtyIds.length} 件`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setSaveMessage(
				currentId
					? `保存失敗: id=${currentId} / ${message}`
					: `保存失敗: ${message}`,
			);
		} finally {
			setIsSavingAll(false);
		}
	};

	const filteredPlayers = useMemo(() => {
		const normalizedQuery = normalize(nameQuery);
		return players.filter((player) => {
			const draft =
				draftsById[player.id] ??
				baselineById[player.id] ??
				toPlayerDraft(player);
			const byGender =
				genderFilter === "all" ? true : draft.gender === genderFilter;
			if (!byGender) {
				return false;
			}
			if (normalizedQuery.length === 0) {
				return true;
			}
			return buildSearchTarget(draft).includes(normalizedQuery);
		});
	}, [genderFilter, nameQuery, players, draftsById, baselineById]);

	return (
		<section className="card">
			<h2>一覧 / 編集</h2>
			<div className="table-controls">
				<input
					type="search"
					placeholder="選手名検索（姓・名・フリガナ・英字）"
					value={nameQuery}
					onChange={(event) => setNameQuery(event.target.value)}
				/>
				<select
					value={genderFilter}
					onChange={(event) =>
						setGenderFilter(event.target.value as GenderFilter)
					}
				>
					<option value="all">男女すべて</option>
					<option value="male">男性のみ</option>
					<option value="female">女性のみ</option>
				</select>
			</div>
			<div className="bulk-save-controls">
				<button
					type="button"
					className="bulk-save-button"
					disabled={dirtyIds.length === 0 || isSavingAll}
					onClick={() => void handleSaveAll()}
				>
					{isSavingAll
						? "DBに保存中..."
						: `変更をまとめてDB保存 (${dirtyIds.length}件)`}
				</button>
				{saveMessage.length > 0 ? <p className="small">{saveMessage}</p> : null}
			</div>
			<table>
				<thead>
					<tr>
						<th>プレビュー</th>
						<th>ID</th>
						<th>姓</th>
						<th>名</th>
						<th>姓フリガナ</th>
						<th>名フリガナ</th>
						<th>英字姓</th>
						<th>英字名</th>
						<th className="gender-cell">性別</th>
						<th>画像URL</th>
						<th>出身地</th>
						<th>生年月日</th>
					</tr>
				</thead>
				<tbody>
					{filteredPlayers.map((player) => (
						<PlayerRow
							key={player.id}
							playerId={player.id}
							token={token}
							draft={getDraftById(player.id) ?? toPlayerDraft(player)}
							onDraftFieldChange={handleDraftFieldChange}
							onDraftBirthDateChange={handleDraftBirthDateChange}
						/>
					))}
				</tbody>
			</table>
		</section>
	);
};
