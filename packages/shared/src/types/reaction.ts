import type { z } from "zod";
import type { PostReactionSchema } from "../schemas/reaction";

export type PostReactionType = z.infer<typeof PostReactionSchema>;
