import { BaseMediaSchema } from "@kotobad/shared/src/schemas";

export const OpenAPIUploadImageResponseSchema =
	BaseMediaSchema.UploadImageResponseSchema.openapi(
		"UploadImageResponseSchema",
	);
