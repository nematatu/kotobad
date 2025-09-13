import { BaseLabelSchema } from "@b3s/shared/src/schemas";

export const OpenAPILabelSchema = BaseLabelSchema.ThreadLabelSchema.openapi(
	"LabelSchema",
	{
		description: "ラベルスキーマ",
		example: {
			id: 1,
			name: "国内大会",
		},
	},
);

export const OpenAPILabelListSchema =
	BaseLabelSchema.LabelListSchema.openapi("LabelListSchema");
