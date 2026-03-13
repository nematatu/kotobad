import { z } from "@hono/zod-openapi";

export const UploadImageTargetSchema = z.enum(["thread", "post"]);

export const UploadImageResponseSchema = z.object({
	imageUrl: z.string().url(),
});
