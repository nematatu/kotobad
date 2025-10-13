import type {
	ThreadLabelSchema,
	LabelListSchema,
	ThreadThreadLabelSchema,
} from "../schemas/label";
import type { z } from "zod";

export type LabelType = z.infer<typeof ThreadLabelSchema>;

export type ThreadThreadLabelType = z.infer<typeof ThreadThreadLabelSchema>;

export type LabelListType = z.infer<typeof LabelListSchema>;
