import { CreatePostSchema, PostSchema } from "@kotobad/shared/src/schemas/post";
import type { PostType } from "@kotobad/shared/src/types";
import type { InferResponseType } from "hono";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import type { client } from "@/lib/api/honoClient";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	const value = CreatePostSchema.parse(json);
	const raw = await createPost(value);
	const thread = PostSchema.parse(raw);

	revalidateTag("threads");
	revalidateTag(`thread:${value.threadId}`);
	return NextResponse.json(thread);
}

async function createPost(values: PostType.CreatePostType) {
	type resType = InferResponseType<typeof client.bbs.posts.create.$post>;
	const url = await getApiUrl("CREATE_POST");
	return BffFetcher<resType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
