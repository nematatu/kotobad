import { BaseTagSchema } from "@kotobad/shared/src/schemas";

export const OpenAPITagSchema = BaseTagSchema.ThreadTagSchema.openapi(
	"TagSchema",
	{
		description: "タグスキーマ",
		example: {
			id: 1,
			name: "国内大会",
		},
	},
);

export const OpenAPITagListSchema =
	BaseTagSchema.TagListSchema.openapi("TagListSchema");
