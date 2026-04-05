import type { z } from "zod";
import type {
	CreateThreadSchema,
	ThreadListSchema,
	ThreadSchema,
} from "../schemas/thread";

export type ThreadType = z.infer<typeof ThreadSchema>;

export type CreateThreadType = z.infer<typeof CreateThreadSchema>;

export type ThreadListType = z.infer<typeof ThreadListSchema>;
