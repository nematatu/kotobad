import type { z } from "zod";
import type {
	TagListSchema,
	ThreadTagSchema,
	ThreadThreadTagSchema,
} from "../schemas/tag";

export type TagType = z.infer<typeof ThreadTagSchema>;

export type ThreadThreadTagType = z.infer<typeof ThreadThreadTagSchema>;

export type TagListType = z.infer<typeof TagListSchema>;
