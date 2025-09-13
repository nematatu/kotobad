import { LabelSchema, LabelListSchema } from "../schemas/label";
import { z } from "zod";

export type LabelType = z.infer<typeof LabelSchema>;

export type LabelListType = z.infer<typeof LabelListSchema>;
