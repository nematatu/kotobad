import { type SubmitEvent, useRef, useState } from "react";
import { uploadPlayerImage } from "../lib/api";
import {
	buildBirthDateInput,
	sanitizeBirthDay,
	sanitizeBirthMonth,
	sanitizeBirthYear,
} from "../lib/birthDate";
import {
	inferSingleNameByReading,
	normalizeFuriganaInput,
	normalizeRomajiInput,
} from "../lib/nameInference";
import { PREFECTURES } from "../lib/prefectures";
import type { PlayerPayload } from "../types";
import { GenderToggleButtons } from "./GenderToggleButtons";
import { ImageCropUploadDialog } from "./ImageCropUploadDialog";

type CreatePlayerFormProps = {
	token: string;
	onCreate: (payload: PlayerPayload) => Promise<void>;
};

const initialForm: PlayerPayload = {
	lastName: "",
	firstName: "",
	lastFurigana: "",
	firstFurigana: "",
	englishLastName: "",
	englishFirstName: "",
	gender: null,
	imageUrl: null,
	birthPlace: "",
	birthDate: null,
};

type AutoFillKey =
	| "lastFurigana"
	| "firstFurigana"
	| "englishLastName"
	| "englishFirstName"
	| "gender";

const initialManualState: Record<AutoFillKey, boolean> = {
	lastFurigana: false,
	firstFurigana: false,
	englishLastName: false,
	englishFirstName: false,
	gender: false,
};
const KANA_ONLY_PATTERN = /^[ぁ-ゖァ-ヺー・\s]+$/u;

export const CreatePlayerForm = ({
	token,
	onCreate,
}: CreatePlayerFormProps) => {
	const [form, setForm] = useState<PlayerPayload>(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [cropSourceFile, setCropSourceFile] = useState<File | null>(null);
	const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
	const [manualEdited, setManualEdited] =
		useState<Record<AutoFillKey, boolean>>(initialManualState);
	const [lastNameKanaReading, setLastNameKanaReading] = useState("");
	const [firstNameKanaReading, setFirstNameKanaReading] = useState("");
	const [birthYear, setBirthYear] = useState("");
	const [birthMonth, setBirthMonth] = useState("");
	const [birthDay, setBirthDay] = useState("");
	const monthInputRef = useRef<HTMLInputElement>(null);
	const dayInputRef = useRef<HTMLInputElement>(null);

	const updateField = (key: keyof PlayerPayload, value: string) => {
		setForm((prev) => ({
			...prev,
			[key]:
				key === "birthDate" || key === "imageUrl" || key === "gender"
					? value.trim().length > 0
						? value
						: null
					: value,
		}));
	};

	const updateBirthDate = (year: string, month: string, day: string) => {
		setBirthYear(year);
		setBirthMonth(month);
		setBirthDay(day);
		setForm((prev) => ({
			...prev,
			birthDate: buildBirthDateInput(year, month, day),
		}));
	};

	const applyInferredLastNameFields = (inferred: {
		furigana: string;
		english?: string;
	}) => {
		setForm((prev) => {
			let hasChange = false;
			const next = { ...prev };
			if (
				!manualEdited.lastFurigana &&
				next.lastFurigana !== inferred.furigana
			) {
				next.lastFurigana = inferred.furigana;
				hasChange = true;
			}
			if (
				typeof inferred.english === "string" &&
				!manualEdited.englishLastName &&
				next.englishLastName !== inferred.english
			) {
				next.englishLastName = inferred.english;
				hasChange = true;
			}
			return hasChange ? next : prev;
		});
	};

	const applyInferredFirstNameFields = (inferred: {
		furigana: string;
		english?: string;
	}) => {
		setForm((prev) => {
			let hasChange = false;
			const next = { ...prev };
			if (
				!manualEdited.firstFurigana &&
				next.firstFurigana !== inferred.furigana
			) {
				next.firstFurigana = inferred.furigana;
				hasChange = true;
			}
			if (
				typeof inferred.english === "string" &&
				!manualEdited.englishFirstName &&
				next.englishFirstName !== inferred.english
			) {
				next.englishFirstName = inferred.english;
				hasChange = true;
			}
			return hasChange ? next : prev;
		});
	};

	const applyLastNameInference = (
		kanjiValue: string,
		readingValue?: string,
	) => {
		const candidateReading =
			typeof readingValue === "string" && readingValue.trim().length > 0
				? readingValue
				: kanjiValue;
		const inferred = inferSingleNameByReading(candidateReading);
		if (!inferred) {
			return;
		}
		applyInferredLastNameFields(inferred);
	};

	const applyFirstNameInference = (
		kanjiValue: string,
		readingValue?: string,
	) => {
		const candidateReading =
			typeof readingValue === "string" && readingValue.trim().length > 0
				? readingValue
				: kanjiValue;
		const inferred = inferSingleNameByReading(candidateReading);
		if (!inferred) {
			return;
		}
		applyInferredFirstNameFields(inferred);
	};

	const handleLastNameCommit = (
		nextLastName?: string,
		nextReading?: string,
	) => {
		applyLastNameInference(nextLastName ?? form.lastName, nextReading);
	};

	const handleFirstNameCommit = (
		nextFirstName?: string,
		nextReading?: string,
	) => {
		applyFirstNameInference(nextFirstName ?? form.firstName, nextReading);
	};

	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			await onCreate(form);
			setForm(initialForm);
			setManualEdited(initialManualState);
			setLastNameKanaReading("");
			setFirstNameKanaReading("");
			updateBirthDate("", "", "");
			setImageUploadError("");
			setCropSourceFile(null);
			setIsCropDialogOpen(false);
		} finally {
			setIsSubmitting(false);
		}
	};

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
			const imageUrl = await uploadPlayerImage(token, file);
			setForm((prev) => ({
				...prev,
				imageUrl,
			}));
			setIsCropDialogOpen(false);
			setCropSourceFile(null);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setImageUploadError(message);
		} finally {
			setIsUploadingImage(false);
		}
	};

	const handleAutoFillFieldChange = (key: AutoFillKey, value: string) => {
		const normalizedValue =
			key === "lastFurigana" || key === "firstFurigana"
				? normalizeFuriganaInput(value)
				: key === "englishLastName" || key === "englishFirstName"
					? normalizeRomajiInput(value)
					: value;
		setManualEdited((prev) => ({
			...prev,
			[key]: true,
		}));
		updateField(key, normalizedValue);
	};

	const handleBirthYearChange = (value: string) => {
		const next = sanitizeBirthYear(value);
		updateBirthDate(next, birthMonth, birthDay);
		if (next.length === 4) {
			monthInputRef.current?.focus();
		}
	};

	const handleBirthMonthChange = (value: string) => {
		const next = sanitizeBirthMonth(value);
		updateBirthDate(birthYear, next, birthDay);
		if (next.length === 2) {
			dayInputRef.current?.focus();
		}
	};

	const handleBirthDayChange = (value: string) => {
		const next = sanitizeBirthDay(value);
		updateBirthDate(birthYear, birthMonth, next);
	};

	return (
		<section className="card">
			<h2>新規追加</h2>
			<form onSubmit={handleSubmit}>
				<div className="grid">
					<input
						required
						placeholder="姓（例: 山口）"
						value={form.lastName}
						onChange={(event) => {
							updateField("lastName", event.target.value);
							const nativeEvent = event.nativeEvent as InputEvent;
							if (nativeEvent.isComposing) {
								const nextReading = event.currentTarget.value;
								if (KANA_ONLY_PATTERN.test(nextReading)) {
									setLastNameKanaReading(nextReading);
								}
							}
						}}
						onBlur={() => handleLastNameCommit(undefined, lastNameKanaReading)}
						onCompositionEnd={(event) => {
							const reading = lastNameKanaReading || event.data;
							handleLastNameCommit(event.currentTarget.value, reading);
							setLastNameKanaReading("");
						}}
						onCompositionUpdate={(event) => {
							if (KANA_ONLY_PATTERN.test(event.data)) {
								setLastNameKanaReading(event.data);
							}
						}}
					/>
					<input
						required
						placeholder="名（例: 茜）"
						value={form.firstName}
						onChange={(event) => {
							updateField("firstName", event.target.value);
							const nativeEvent = event.nativeEvent as InputEvent;
							if (nativeEvent.isComposing) {
								const nextReading = event.currentTarget.value;
								if (KANA_ONLY_PATTERN.test(nextReading)) {
									setFirstNameKanaReading(nextReading);
								}
							}
						}}
						onBlur={() =>
							handleFirstNameCommit(undefined, firstNameKanaReading)
						}
						onCompositionEnd={(event) => {
							const reading = firstNameKanaReading || event.data;
							handleFirstNameCommit(event.currentTarget.value, reading);
							setFirstNameKanaReading("");
						}}
						onCompositionUpdate={(event) => {
							if (KANA_ONLY_PATTERN.test(event.data)) {
								setFirstNameKanaReading(event.data);
							}
						}}
					/>
					<input
						required
						placeholder="姓フリガナ（例: ヤマグチ）"
						value={form.lastFurigana}
						onChange={(event) =>
							handleAutoFillFieldChange("lastFurigana", event.target.value)
						}
					/>
					<input
						required
						placeholder="名フリガナ（例: アカネ）"
						value={form.firstFurigana}
						onChange={(event) =>
							handleAutoFillFieldChange("firstFurigana", event.target.value)
						}
					/>
					<input
						required
						placeholder="英字姓（例: YAMAGUCHI）"
						value={form.englishLastName}
						onChange={(event) =>
							handleAutoFillFieldChange("englishLastName", event.target.value)
						}
					/>
					<input
						required
						placeholder="英字名（例: Akane）"
						value={form.englishFirstName}
						onChange={(event) =>
							handleAutoFillFieldChange("englishFirstName", event.target.value)
						}
					/>
					<GenderToggleButtons
						value={form.gender}
						onChange={(value) =>
							handleAutoFillFieldChange("gender", value ?? "")
						}
					/>
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
						placeholder="アップロード後に自動入力されます"
						value={form.imageUrl ?? ""}
						onChange={(event) => updateField("imageUrl", event.target.value)}
					/>
					{isUploadingImage ? (
						<p className="small">画像アップロード中...</p>
					) : null}
					{imageUploadError.length > 0 ? (
						<p className="small">画像アップロード失敗: {imageUploadError}</p>
					) : null}
					{form.imageUrl ? (
						<img
							src={form.imageUrl}
							alt="選手画像プレビュー"
							style={{
								width: "100%",
								maxWidth: "240px",
								height: "auto",
								borderRadius: "8px",
								border: "1px solid #e2e8f0",
							}}
						/>
					) : null}
					<select
						required
						value={form.birthPlace}
						onChange={(event) => updateField("birthPlace", event.target.value)}
					>
						<option value="">出身地を選択</option>
						{PREFECTURES.map((prefecture) => (
							<option key={prefecture} value={prefecture}>
								{prefecture}
							</option>
						))}
					</select>
					<div className="birth-date-fields">
						<input
							type="text"
							inputMode="numeric"
							placeholder="年"
							maxLength={4}
							value={birthYear}
							onChange={(event) => handleBirthYearChange(event.target.value)}
						/>
						<span>/</span>
						<input
							ref={monthInputRef}
							type="text"
							inputMode="numeric"
							placeholder="月"
							maxLength={2}
							value={birthMonth}
							onChange={(event) => handleBirthMonthChange(event.target.value)}
						/>
						<span>/</span>
						<input
							ref={dayInputRef}
							type="text"
							inputMode="numeric"
							placeholder="日"
							maxLength={2}
							value={birthDay}
							onChange={(event) => handleBirthDayChange(event.target.value)}
						/>
					</div>
				</div>
				<div className="form-actions">
					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "追加中..." : "選手を追加"}
					</button>
				</div>
			</form>
			<ImageCropUploadDialog
				open={isCropDialogOpen}
				file={cropSourceFile}
				title="選手画像を切り抜き"
				isUploading={isUploadingImage}
				uploadErrorMessage={imageUploadError}
				onCloseAction={closeCropDialog}
				onSubmitAction={uploadCroppedImage}
			/>
		</section>
	);
};
