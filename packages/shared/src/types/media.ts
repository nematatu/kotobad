import type { z } from "zod";
import type { UploadImageTargetSchema } from "../schemas/media";

export type UploadImageTargetType = z.infer<typeof UploadImageTargetSchema>;
