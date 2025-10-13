import type { z } from "zod";
import type {
	LabelListSchema,
	ThreadLabelSchema,
	ThreadThreadLabelSchema,
} from "../schemas/label";

export type LabelType = z.infer<typeof ThreadLabelSchema>;

export type ThreadThreadLabelType = z.infer<typeof ThreadThreadLabelSchema>;

export type LabelListType = z.infer<typeof LabelListSchema>;
