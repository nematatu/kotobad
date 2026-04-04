import { useEffect, useMemo, useState } from "react";
import {
	fetchPlayerCareers,
	replacePlayerCareers,
	uploadPlayerImage,
} from "../lib/api";
import { epochSecondsToDateInput } from "../lib/date";
import {
	normalizeFuriganaInput,
	normalizeRomajiInput,
} from "../lib/nameInference";
import { buildPrefectureOptions } from "../lib/prefectures";
import type {
	Career,
	CareerPayload,
	Player,
	PlayerPayload,
	PlayerUpdatePayload,
} from "../types";
import { GenderToggleButtons } from "./GenderToggleButtons";
import { ImageCropUploadDialog } from "./ImageCropUploadDialog";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";

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
type CareerEditableField = "name" | "category" | "startYear" | "endYear";
type CareerDraft = {
	localId: string;
	name: string;
	category: string;
	startYear: string;
	endYear: string;
};
const careerCategoryOptions = [
	"SJリーグ",
	"大学",
	"高校",
	"中学",
	"クラブ",
	"ジュニア",
] as const;
const careerYearMin = 1900;
const careerYearMax = new Date().getFullYear();
const sjLeagueTeamOptions = [
	"ACT SAIKYO",
	"BIPROGY",
	"Cheerful鳥取",
	"NTT 東日本",
	"NTT東日本",
	"コンサドーレ",
	"ジェイテクトStingers",
	"トナミ運輸",
	"ヨネックス",
	"レゾナック",
	"七十七銀行",
	"三菱自動車京都",
	"丸杉スティーラーズ",
	"再春館製薬所",
	"北都銀行",
	"大同特殊鋼",
	"山陰合同銀行",
	"岐阜Bluvic",
	"広島ガス",
	"日立情報通信エンジニアリング",
	"東海興業",
	"豊田通商",
	"金沢学院クラブ",
] as const;
const careerYearOptions = Array.from(
	{ length: careerYearMax - careerYearMin + 1 },
	(_, index) => String(careerYearMin + index),
);
type CareerCategory = (typeof careerCategoryOptions)[number];
const isCareerCategory = (value: string): value is CareerCategory =>
	careerCategoryOptions.includes(value as CareerCategory);

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

const normalizeEditableValue = (key: EditableField, value: string): string => {
	if (key === "lastFurigana" || key === "firstFurigana") {
		return normalizeFuriganaInput(value);
	}
	if (key === "englishLastName" || key === "englishFirstName") {
		return normalizeRomajiInput(value);
	}
	return value;
};

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

const toCareerDraft = (career: Career): CareerDraft => ({
	localId:
		typeof crypto !== "undefined" ? crypto.randomUUID() : String(career.id),
	name: career.name,
	category: isCareerCategory(career.category) ? career.category : "",
	startYear: career.startYear ? String(career.startYear) : "",
	endYear: career.endYear ? String(career.endYear) : "",
});

const toCareerPayload = (
	draft: CareerDraft,
): { ok: true; value: CareerPayload } | { ok: false; message: string } => {
	const name = draft.name.trim();
	if (name.length === 0) {
		return { ok: false, message: "経歴名は必須です" };
	}
	if (!isCareerCategory(draft.category)) {
		return { ok: false, message: "カテゴリを選択してください" };
	}

	const parseYear = (value: string) => {
		const trimmed = value.trim();
		if (trimmed.length === 0) return null;
		const year = Number.parseInt(trimmed, 10);
		if (
			!Number.isSafeInteger(year) ||
			year < careerYearMin ||
			year > careerYearMax
		) {
			return Number.NaN;
		}
		return year;
	};

	const startYear = parseYear(draft.startYear);
	if (Number.isNaN(startYear)) {
		return {
			ok: false,
			message: `開始年は ${careerYearMin}-${careerYearMax} で指定してください`,
		};
	}
	const endYear = parseYear(draft.endYear);
	if (Number.isNaN(endYear)) {
		return {
			ok: false,
			message: `終了年は ${careerYearMin}-${careerYearMax} で指定してください`,
		};
	}
	if (startYear != null && endYear != null && startYear > endYear) {
		return { ok: false, message: "開始年は終了年以下で指定してください" };
	}

	return {
		ok: true,
		value: {
			name,
			category: draft.category,
			startYear,
			endYear,
		},
	};
};

const PlayerEditorCard = ({
	draft,
	onOpenAction,
}: {
	draft: PlayerPayload;
	onOpenAction: () => void;
}) => {
	const fullName = `${draft.lastName}${draft.firstName}`.trim();

	return (
		<article className="player-editor-card">
			<button
				type="button"
				className="player-editor-summary player-editor-summary-button"
				onClick={onOpenAction}
				aria-label={`${fullName || "未入力の選手"} を編集`}
			>
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
			</button>
		</article>
	);
};

const PlayerEditorModal = ({
	open,
	token,
	playerId,
	draft,
	canMovePrev,
	canMoveNext,
	onMovePrevAction,
	onMoveNextAction,
	onCloseAction,
	onDraftFieldChange,
	onDraftBirthDateChange,
}: {
	open: boolean;
	token: string;
	playerId: number;
	draft: PlayerPayload;
	canMovePrev: boolean;
	canMoveNext: boolean;
	onMovePrevAction: () => void;
	onMoveNextAction: () => void;
	onCloseAction: () => void;
	onDraftFieldChange: (id: number, key: EditableField, value: string) => void;
	onDraftBirthDateChange: (id: number, value: string) => void;
}) => {
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [cropSourceFile, setCropSourceFile] = useState<File | null>(null);
	const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
	const [careers, setCareers] = useState<CareerDraft[]>([]);
	const [isLoadingCareers, setIsLoadingCareers] = useState(false);
	const [isSavingCareers, setIsSavingCareers] = useState(false);
	const [careerMessage, setCareerMessage] = useState("");
	const birthPlaceOptions = useMemo(
		() => buildPrefectureOptions(draft.birthPlace),
		[draft.birthPlace],
	);

	useEffect(() => {
		if (!open) {
			return;
		}

		let cancelled = false;
		const loadCareers = async () => {
			setIsLoadingCareers(true);
			setCareerMessage("");
			try {
				const rows = await fetchPlayerCareers(token, playerId);
				if (!cancelled) {
					setCareers(rows.map(toCareerDraft));
				}
			} catch (error) {
				if (!cancelled) {
					const message =
						error instanceof Error ? error.message : String(error);
					setCareerMessage(`経歴の読み込み失敗: ${message}`);
				}
			} finally {
				if (!cancelled) {
					setIsLoadingCareers(false);
				}
			}
		};

		void loadCareers();
		return () => {
			cancelled = true;
		};
	}, [open, playerId, token]);

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

	const handleCareerFieldChange = (
		localId: string,
		key: CareerEditableField,
		value: string,
	) => {
		setCareers((prev) =>
			prev.map((career) =>
				career.localId === localId ? { ...career, [key]: value } : career,
			),
		);
	};

	const handleAddCareer = () => {
		setCareers((prev) => [
			...prev,
			{
				localId: crypto.randomUUID(),
				name: "",
				category: "",
				startYear: String(careerYearMax),
				endYear: String(careerYearMax),
			},
		]);
	};

	const handleRemoveCareer = (localId: string) => {
		setCareers((prev) => prev.filter((career) => career.localId !== localId));
	};

	const handleSaveCareers = async () => {
		if (token.trim().length === 0) {
			setCareerMessage("先に管理トークンを入力してください");
			return;
		}
		if (isSavingCareers) {
			return;
		}

		const payloads: CareerPayload[] = [];
		for (const career of careers) {
			const parsed = toCareerPayload(career);
			if (!parsed.ok) {
				setCareerMessage(parsed.message);
				return;
			}
			payloads.push(parsed.value);
		}

		setCareerMessage("");
		setIsSavingCareers(true);
		try {
			const saved = await replacePlayerCareers(token, playerId, payloads);
			setCareers(saved.map(toCareerDraft));
			setCareerMessage(`経歴を保存しました（${saved.length}件）`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setCareerMessage(`経歴の保存失敗: ${message}`);
		} finally {
			setIsSavingCareers(false);
		}
	};

	return (
		<DialogContent className="player-editor-modal-content">
			<div className="player-editor-modal-header">
				<div className="player-editor-modal-header-main">
					<div className="player-editor-modal-face">
						{draft.imageUrl ? (
							<img
								src={draft.imageUrl}
								alt={`${draft.lastName}${draft.firstName}`}
							/>
						) : (
							<div className="player-editor-modal-face-empty">No Image</div>
						)}
					</div>
					<DialogTitle>
						{`${draft.lastName}${draft.firstName}`.trim() || "選手編集"}
					</DialogTitle>
				</div>
				<DialogClose asChild>
					<button type="button" className="ghost" onClick={onCloseAction}>
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
					<div className="career-header">
						<span>経歴 (Career)</span>
						<button
							type="button"
							className="ghost career-add-button"
							onClick={handleAddCareer}
						>
							行を追加
						</button>
					</div>
					<div className="career-list">
						{isLoadingCareers ? (
							<p className="small">経歴を読み込み中...</p>
						) : careers.length === 0 ? (
							<p className="small">経歴は未登録です。</p>
						) : (
							careers.map((career, index) => (
								<div key={career.localId} className="career-row">
									<select
										value={career.category}
										onChange={(event) =>
											handleCareerFieldChange(
												career.localId,
												"category",
												event.target.value,
											)
										}
									>
										<option value="">カテゴリを選択</option>
										{careerCategoryOptions.map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
									{career.category === "SJリーグ" ? (
										<select
											value={career.name}
											onChange={(event) =>
												handleCareerFieldChange(
													career.localId,
													"name",
													event.target.value,
												)
											}
										>
											<option value="">SJリーグチームを選択</option>
											{sjLeagueTeamOptions.map((teamName) => (
												<option key={teamName} value={teamName}>
													{teamName}
												</option>
											))}
										</select>
									) : (
										<input
											placeholder="経歴名（必須）"
											value={career.name}
											disabled={career.category.length === 0}
											onChange={(event) =>
												handleCareerFieldChange(
													career.localId,
													"name",
													event.target.value,
												)
											}
										/>
									)}
									<select
										value={career.startYear}
										disabled={career.category.length === 0}
										onChange={(event) =>
											handleCareerFieldChange(
												career.localId,
												"startYear",
												event.target.value,
											)
										}
									>
										<option value="">開始年</option>
										{careerYearOptions.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
									<select
										value={career.endYear}
										disabled={career.category.length === 0}
										onChange={(event) =>
											handleCareerFieldChange(
												career.localId,
												"endYear",
												event.target.value,
											)
										}
									>
										<option value="">終了年</option>
										{careerYearOptions.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
									<button
										type="button"
										className="ghost career-delete-button"
										onClick={() => handleRemoveCareer(career.localId)}
										aria-label={`経歴 ${index + 1} を削除`}
									>
										削除
									</button>
								</div>
							))
						)}
					</div>
					<div className="career-actions">
						<button
							type="button"
							className="secondary"
							onClick={() => void handleSaveCareers()}
							disabled={isLoadingCareers || isSavingCareers}
						>
							{isSavingCareers ? "経歴を保存中..." : "経歴を保存"}
						</button>
						{careerMessage.length > 0 ? (
							<p className="small">{careerMessage}</p>
						) : null}
					</div>
				</div>
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
			<div className="player-editor-modal-footer">
				<button
					type="button"
					className="secondary"
					disabled={!canMovePrev}
					onClick={onMovePrevAction}
				>
					戻る
				</button>
				<button
					type="button"
					className="secondary"
					disabled={!canMoveNext}
					onClick={onMoveNextAction}
				>
					次へ
				</button>
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
	const [activePlayerId, setActivePlayerId] = useState<number | null>(null);
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
		const normalizedValue = normalizeEditableValue(key, value);
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
							? normalizedValue.trim().length > 0
								? normalizedValue
								: null
							: normalizedValue,
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

	const activePlayerIndex = useMemo(
		() =>
			activePlayerId == null
				? -1
				: filteredPlayers.findIndex((player) => player.id === activePlayerId),
		[activePlayerId, filteredPlayers],
	);

	const activePlayer =
		activePlayerId == null
			? null
			: (filteredPlayers.find((player) => player.id === activePlayerId) ??
				players.find((player) => player.id === activePlayerId) ??
				null);

	const openPlayerEditorAction = (playerId: number) => {
		setActivePlayerId(playerId);
	};

	const closePlayerEditorAction = () => {
		setActivePlayerId(null);
	};

	const moveToAdjacentPlayerAction = (delta: -1 | 1) => {
		if (activePlayerIndex < 0) {
			return;
		}
		const nextPlayer = filteredPlayers[activePlayerIndex + delta];
		if (!nextPlayer) {
			return;
		}
		setActivePlayerId(nextPlayer.id);
	};

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
						draft={getDraftById(player.id) ?? toPlayerDraft(player)}
						onOpenAction={() => openPlayerEditorAction(player.id)}
					/>
				))}
			</div>
			<Dialog
				open={activePlayerId != null}
				onOpenChange={(open) => {
					if (!open) {
						closePlayerEditorAction();
					}
				}}
			>
				{activePlayer ? (
					<PlayerEditorModal
						open
						token={token}
						playerId={activePlayer.id}
						draft={getDraftById(activePlayer.id) ?? toPlayerDraft(activePlayer)}
						canMovePrev={activePlayerIndex > 0}
						canMoveNext={
							activePlayerIndex >= 0 &&
							activePlayerIndex < filteredPlayers.length - 1
						}
						onMovePrevAction={() => moveToAdjacentPlayerAction(-1)}
						onMoveNextAction={() => moveToAdjacentPlayerAction(1)}
						onCloseAction={closePlayerEditorAction}
						onDraftFieldChange={handleDraftFieldChange}
						onDraftBirthDateChange={handleDraftBirthDateChange}
					/>
				) : null}
			</Dialog>
			{filteredPlayers.length === 0 ? (
				<p className="small">該当する選手がいません。</p>
			) : null}
		</section>
	);
};
