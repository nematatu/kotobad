import type { z } from "zod";
import type {
	TagIconKindSchema,
	TagListSchema,
	ThreadTagSchema,
} from "../schemas/tag";

export type TagIconKindType = z.infer<typeof TagIconKindSchema>;

export type TagType = z.infer<typeof ThreadTagSchema>;

export type TagListType = z.infer<typeof TagListSchema>;
