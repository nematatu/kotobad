import { type FormEvent, useState } from "react";
import type { PlayerPayload } from "../types";

type CreatePlayerFormProps = {
	onCreate: (payload: PlayerPayload) => Promise<void>;
};

const initialForm: PlayerPayload = {
	lastName: "",
	firstName: "",
	lastFurigana: "",
	firstFurigana: "",
	englishLastName: "",
	englishFirstName: "",
	birthPlace: "",
	birthDate: null,
};

export const CreatePlayerForm = ({ onCreate }: CreatePlayerFormProps) => {
	const [form, setForm] = useState<PlayerPayload>(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateField = (key: keyof PlayerPayload, value: string) => {
		setForm((prev) => ({
			...prev,
			[key]:
				key === "birthDate" ? (value.trim().length > 0 ? value : null) : value,
		}));
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			await onCreate(form);
			setForm(initialForm);
		} finally {
			setIsSubmitting(false);
		}
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
						onChange={(event) => updateField("lastName", event.target.value)}
					/>
					<input
						required
						placeholder="名（例: 茜）"
						value={form.firstName}
						onChange={(event) => updateField("firstName", event.target.value)}
					/>
					<input
						required
						placeholder="姓フリガナ（例: ヤマグチ）"
						value={form.lastFurigana}
						onChange={(event) =>
							updateField("lastFurigana", event.target.value)
						}
					/>
					<input
						required
						placeholder="名フリガナ（例: アカネ）"
						value={form.firstFurigana}
						onChange={(event) =>
							updateField("firstFurigana", event.target.value)
						}
					/>
					<input
						required
						placeholder="英字姓（例: YAMAGUCHI）"
						value={form.englishLastName}
						onChange={(event) =>
							updateField("englishLastName", event.target.value)
						}
					/>
					<input
						required
						placeholder="英字名（例: Akane）"
						value={form.englishFirstName}
						onChange={(event) =>
							updateField("englishFirstName", event.target.value)
						}
					/>
					<input
						required
						placeholder="出身地（例: 福井県）"
						value={form.birthPlace}
						onChange={(event) => updateField("birthPlace", event.target.value)}
					/>
					<input
						type="date"
						value={form.birthDate ?? ""}
						onChange={(event) => updateField("birthDate", event.target.value)}
					/>
				</div>
				<div className="form-actions">
					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "追加中..." : "選手を追加"}
					</button>
				</div>
			</form>
		</section>
	);
};
