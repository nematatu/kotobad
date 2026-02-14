import { CreatePostSchema, PostSchema } from "@kotobad/shared/src/schemas/post";
import type { PostType } from "@kotobad/shared/src/types";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";

export async function POST(req: Request) {
	const json = await req.json();
	const value = CreatePostSchema.parse(json);
	const raw = await createPost(value);
	const post = PostSchema.parse(raw);

	revalidateTag("threads");
	revalidateTag(`thread:${value.threadId}`);
	return NextResponse.json(post);
}

async function createPost(values: PostType.CreatePostType) {
	const url = await getApiUrl("CREATE_POST");
	return BffFetcher<PostType.PostType>(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		credentials: "include",
	});
}
