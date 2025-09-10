import { ThreadSchema, CreateThreadSchema } from "../schemas/thread";
import { z } from "zod";

export type ThreadType = z.infer<typeof ThreadSchema>;

export type CreateThreadType = z.infer<typeof CreateThreadSchema>;
