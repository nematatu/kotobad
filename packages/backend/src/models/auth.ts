import { BaseAuthSchema } from "@kotobad/shared/src/schemas";

export const OpenAPILoginSignupSchema =
	BaseAuthSchema.LoginSignupSchema.openapi("LoginSignUpSchema", {
		description: "ログインと新規登録のスキーマ",
		example: {
			username: "ユーザーネーム",
			password: "パスワード",
		},
	});

export const OpenAPIUserJWTSchema = BaseAuthSchema.UserJWTSchema.openapi(
	"UserJWTSchema",
	{
		description: "JWTに保存するユーザーのスキーマ",
		example: {
			id: "ユーザーID",
			username: "ユーザーネーム",
		},
	},
);
