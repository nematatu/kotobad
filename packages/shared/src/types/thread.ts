import {
	ThreadSchema,
	CreateThreadSchema,
	ThreadListSchema,
	EditThreadSchema,
} from "../schemas/thread";
import { z } from "zod";

export type ThreadType = z.infer<typeof ThreadSchema>;

export type CreateThreadType = z.infer<typeof CreateThreadSchema>;

export type ThreadListType = z.infer<typeof ThreadListSchema>;

export type EditThreadType = z.infer<typeof EditThreadSchema>;
