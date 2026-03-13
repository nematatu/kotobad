import type { z } from "zod";
import type {
	UploadImageResponseSchema,
	UploadImageTargetSchema,
} from "../schemas/media";

export type UploadImageTargetType = z.infer<typeof UploadImageTargetSchema>;
export type UploadImageResponseType = z.infer<typeof UploadImageResponseSchema>;
