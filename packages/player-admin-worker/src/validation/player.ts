import { z } from "zod";

const stringField = z.string().trim().min(1).max(120);
const genderField = z.enum(["male", "female"]).nullable().optional();
const imageUrlField = z
	.union([z.string().trim().url().max(2000), z.null()])
	.optional();

const birthDateField = z
	.union([
		z
			.string()
			.trim()
			.regex(/^\d{4}-\d{2}-\d{2}$/),
		z.number().int().nonnegative(),
		z.null(),
	])
	.optional();

export const createPlayerSchema = z
	.object({
		firstName: stringField,
		lastName: stringField,
		firstFurigana: stringField,
		lastFurigana: stringField,
		englishFirstName: stringField,
		englishLastName: stringField,
		gender: genderField,
		imageUrl: imageUrlField,
		birthPlace: stringField,
		birthDate: birthDateField,
	})
	.strict();

export const updatePlayerSchema = createPlayerSchema
	.partial()
	.strict()
	.refine((value) => Object.keys(value).length > 0, {
		message: "更新する項目が必要です",
	});

export const toBirthDateEpochSeconds = (
	value: z.input<typeof birthDateField>,
): { ok: true; value: number | null } | { ok: false; message: string } => {
	if (value === undefined) {
		return { ok: true, value: null };
	}

	if (value === null) {
		return { ok: true, value: null };
	}

	if (typeof value === "number") {
		return { ok: true, value };
	}

	const parsedMs = Date.parse(`${value}T00:00:00Z`);
	if (Number.isNaN(parsedMs)) {
		return {
			ok: false,
			message: "birthDate は YYYY-MM-DD または unix秒で指定してください",
		};
	}

	return { ok: true, value: Math.floor(parsedMs / 1000) };
};
