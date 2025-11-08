import {
	LoginSignupSchema,
	UserJWTSchema,
} from "@kotobad/shared/src/schemas/auth";
import type { AuthType } from "@kotobad/shared/src/types/";
import type { InferResponseType } from "hono";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	// ↓ confirmも含まれていそうだからこのパースで落ちそう
	// 落ちなかった。パスワード確認のバリデーション、フロントでしか行ってないから、バックエンドでのチェックも実装すべきかも
	const payload = LoginSignupSchema.parse(json);

	const signUpRes = await signup(payload);
	const parsedSignUpRes = UserJWTSchema.parse(signUpRes);

	const res = NextResponse.json(parsedSignUpRes);
	return res;
}

export async function signup(values: AuthType.LoginSignupUserType) {
	type resType = InferResponseType<typeof client.auth.signup.$post>;
	const url = await getApiUrl("SIGN_UP");
	return BffFetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
}
