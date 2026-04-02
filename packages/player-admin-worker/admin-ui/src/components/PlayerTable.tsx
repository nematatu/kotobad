import { useEffect, useMemo, useState } from "react";
import { uploadPlayerImage } from "../lib/api";
import { epochSecondsToDateInput } from "../lib/date";
import { buildPrefectureOptions } from "../lib/prefectures";
import type { Player, PlayerPayload, PlayerUpdatePayload } from "../types";
import { GenderToggleButtons } from "./GenderToggleButtons";
import { ImageCropUploadDialog } from "./ImageCropUploadDialog";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

type PlayerTableProps = {
	token: string;
	players: Player[];
	onSave: (id: number, payload: PlayerUpdatePayload) => Promise<void>;
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

const buildUpdatePayload = (
	baseline: PlayerPayload,
	draft: PlayerPayload,
): PlayerUpdatePayload => {
	const payload: PlayerUpdatePayload = {};

	if (draft.lastName !== baseline.lastName) payload.lastName = draft.lastName;
	if (draft.firstName !== baseline.firstName)
		payload.firstName = draft.firstName;
	if (draft.lastFurigana !== baseline.lastFurigana) {
		payload.lastFurigana = draft.lastFurigana;
	}
	if (draft.firstFurigana !== baseline.firstFurigana) {
		payload.firstFurigana = draft.firstFurigana;
	}
	if (draft.englishLastName !== baseline.englishLastName) {
		payload.englishLastName = draft.englishLastName;
	}
	if (draft.englishFirstName !== baseline.englishFirstName) {
		payload.englishFirstName = draft.englishFirstName;
	}
	if (draft.gender !== baseline.gender) payload.gender = draft.gender;
	if (draft.imageUrl !== baseline.imageUrl) payload.imageUrl = draft.imageUrl;
	if (draft.birthPlace !== baseline.birthPlace)
		payload.birthPlace = draft.birthPlace;
	if (draft.birthDate !== baseline.birthDate)
		payload.birthDate = draft.birthDate;

	return payload;
};

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

const PlayerEditorCard = ({
	token,
	playerId,
	draft,
	onDraftFieldChange,
	onDraftBirthDateChange,
}: {
	token: string;
	playerId: number;
	draft: PlayerPayload;
	onDraftFieldChange: (id: number, key: EditableField, value: string) => void;
	onDraftBirthDateChange: (id: number, value: string) => void;
}) => {
	const fullName = `${draft.lastName}${draft.firstName}`.trim();

	return (
		<article className="player-editor-card">
			<div className="player-editor-summary">
				<div className="player-preview">
					{draft.imageUrl ? (
						<img
							src={draft.imageUrl}
							alt={`${draft.lastName}${draft.firstName}`}
						/>
					) : (
						<div className="player-preview-empty">No Image</div>
					)}
					<div className="player-preview-name">
						<p>{fullName.length > 0 ? fullName : "（未入力）"}</p>
					</div>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<button type="button" className="ghost player-editor-open-button">
							編集
						</button>
					</DialogTrigger>
					<PlayerEditorModal
						token={token}
						playerId={playerId}
						draft={draft}
						onDraftFieldChange={onDraftFieldChange}
						onDraftBirthDateChange={onDraftBirthDateChange}
					/>
				</Dialog>
			</div>
		</article>
	);
};

const PlayerEditorModal = ({
	token,
	playerId,
	draft,
	onDraftFieldChange,
	onDraftBirthDateChange,
}: {
	token: string;
	playerId: number;
	draft: PlayerPayload;
	onDraftFieldChange: (id: number, key: EditableField, value: string) => void;
	onDraftBirthDateChange: (id: number, value: string) => void;
}) => {
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [cropSourceFile, setCropSourceFile] = useState<File | null>(null);
	const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
	const birthPlaceOptions = useMemo(
		() => buildPrefectureOptions(draft.birthPlace),
		[draft.birthPlace],
	);

	const openCropDialog = (file: File | null) => {
		if (!file) {
			return;
		}
		setImageUploadError("");
		setCropSourceFile(file);
		setIsCropDialogOpen(true);
	};

	const closeCropDialog = () => {
		if (isUploadingImage) {
			return;
		}
		setIsCropDialogOpen(false);
		setCropSourceFile(null);
	};

	const uploadCroppedImage = async (file: File) => {
		if (token.trim().length === 0) {
			setImageUploadError("先に管理トークンを入力してください");
			return;
		}

		setImageUploadError("");
		setIsUploadingImage(true);
		try {
			const uploadedImageUrl = await uploadPlayerImage(token, file);
			onDraftFieldChange(playerId, "imageUrl", uploadedImageUrl);
			setIsCropDialogOpen(false);
			setCropSourceFile(null);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setImageUploadError(message);
		} finally {
			setIsUploadingImage(false);
		}
	};

	return (
		<DialogContent className="player-editor-modal-content">
			<div className="player-editor-modal-header">
				<DialogTitle>
					{`${draft.lastName}${draft.firstName}`.trim() || "選手編集"}
				</DialogTitle>
				<DialogClose asChild>
					<button type="button" className="ghost">
						閉じる
					</button>
				</DialogClose>
			</div>
			<div className="player-editor-fields">
				<label className="field">
					<span>姓</span>
					<input
						value={draft.lastName}
						onChange={(event) =>
							onDraftFieldChange(playerId, "lastName", event.target.value)
						}
					/>
				</label>
				<label className="field">
					<span>名</span>
					<input
						value={draft.firstName}
						onChange={(event) =>
							onDraftFieldChange(playerId, "firstName", event.target.value)
						}
					/>
				</label>
				<label className="field">
					<span>姓フリガナ</span>
					<input
						value={draft.lastFurigana}
						onChange={(event) =>
							onDraftFieldChange(playerId, "lastFurigana", event.target.value)
						}
					/>
				</label>
				<label className="field">
					<span>名フリガナ</span>
					<input
						value={draft.firstFurigana}
						onChange={(event) =>
							onDraftFieldChange(playerId, "firstFurigana", event.target.value)
						}
					/>
				</label>
				<label className="field">
					<span>英字姓</span>
					<input
						value={draft.englishLastName}
						onChange={(event) =>
							onDraftFieldChange(
								playerId,
								"englishLastName",
								event.target.value,
							)
						}
					/>
				</label>
				<label className="field">
					<span>英字名</span>
					<input
						value={draft.englishFirstName}
						onChange={(event) =>
							onDraftFieldChange(
								playerId,
								"englishFirstName",
								event.target.value,
							)
						}
					/>
				</label>
				<div className="field">
					<span>性別</span>
					<GenderToggleButtons
						value={draft.gender}
						onChange={(value) =>
							onDraftFieldChange(playerId, "gender", value ?? "")
						}
					/>
				</div>
				<label className="field">
					<span>出身地</span>
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
				</label>
				<label className="field field-full">
					<span>生年月日</span>
					<input
						type="date"
						value={draft.birthDate ?? ""}
						onChange={(event) =>
							onDraftBirthDateChange(playerId, event.target.value)
						}
					/>
				</label>
				<div className="field field-full">
					<span>画像URL</span>
					<div className="image-edit-grid">
						<input
							type="file"
							accept="image/jpeg,image/png,image/webp,image/avif"
							onChange={(event) => {
								openCropDialog(event.target.files?.[0] ?? null);
								event.currentTarget.value = "";
							}}
						/>
						<input
							type="url"
							value={draft.imageUrl ?? ""}
							onChange={(event) =>
								onDraftFieldChange(playerId, "imageUrl", event.target.value)
							}
						/>
						{isUploadingImage ? (
							<span className="small">アップロード中...</span>
						) : null}
						{imageUploadError.length > 0 ? (
							<span className="small">失敗: {imageUploadError}</span>
						) : null}
						{draft.imageUrl ? (
							<button
								type="button"
								className="ghost image-preview-button"
								onClick={() => setIsPreviewOpen(true)}
							>
								画像を拡大
							</button>
						) : null}
					</div>
				</div>
			</div>
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
			<ImageCropUploadDialog
				open={isCropDialogOpen}
				file={cropSourceFile}
				title="選手画像を切り抜き"
				isUploading={isUploadingImage}
				uploadErrorMessage={imageUploadError}
				onCloseAction={closeCropDialog}
				onSubmitAction={uploadCroppedImage}
			/>
		</DialogContent>
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
				const baseline = baselineById[id];
				if (!draft || !baseline) {
					continue;
				}
				const payload = buildUpdatePayload(baseline, draft);
				if (Object.keys(payload).length === 0) {
					continue;
				}
				await onSave(id, payload);
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

			<div className="player-grid">
				{filteredPlayers.map((player) => (
					<PlayerEditorCard
						key={player.id}
						token={token}
						playerId={player.id}
						draft={getDraftById(player.id) ?? toPlayerDraft(player)}
						onDraftFieldChange={handleDraftFieldChange}
						onDraftBirthDateChange={handleDraftBirthDateChange}
					/>
				))}
			</div>
			{filteredPlayers.length === 0 ? (
				<p className="small">該当する選手がいません。</p>
			) : null}
		</section>
	);
};
