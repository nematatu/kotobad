import type { z } from "zod";
import type {
	PostReactionSchema,
	ReactionOptionSchema,
} from "../schemas/reaction";

export type PostReactionType = z.infer<typeof PostReactionSchema>;
export type ReactionOptionType = z.infer<typeof ReactionOptionSchema>;
