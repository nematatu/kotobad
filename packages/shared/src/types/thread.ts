import type { z } from "zod";
import type {
	CreateThreadSchema,
	EditThreadSchema,
	ThreadListSchema,
	ThreadSchema,
} from "../schemas/thread";

export type ThreadType = z.infer<typeof ThreadSchema>;

export type CreateThreadType = z.infer<typeof CreateThreadSchema>;

export type ThreadListType = z.infer<typeof ThreadListSchema>;

export type EditThreadType = z.infer<typeof EditThreadSchema>;
