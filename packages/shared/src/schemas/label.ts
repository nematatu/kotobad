import { z } from "zod";

export const ThreadLabelSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1),
});

export const ThreadThreadLabelSchema = z.object({
	threadId: z.number().int().positive(),
	labelId: z.number().int().positive(),
	labels: ThreadLabelSchema,
});

export const LabelListSchema = z.array(ThreadLabelSchema);
