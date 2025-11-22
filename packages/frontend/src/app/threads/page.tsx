import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type {
	ThreadListType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { notFound } from "next/navigation";
import type { BffFetcherError } from "@/lib/api/fetcher/bffFetcher";
import { BffFetcher } from "@/lib/api/fetcher/bffFetcher";
import { getApiUrl } from "@/lib/config/apiUrls";
import ThreadPageClient from "./components/view/ThreadPageClient";
export const revalidate = 900;
export const dynamic = "force-static";
const cacheBust =
	process.env.CF_PAGES_COMMIT_SHA ??
	process.env.VERCEL_GIT_COMMIT_SHA ??
	process.env.NEXT_PUBLIC_CACHE_BUST ??
	process.env.NEXT_BUILD_ID ??
	"";

export type Props = {
	searchParams?: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const currentPage = Number(params?.page ?? "1");

	const targetUrl = await getApiUrl("GET_ALL_THREADS");
	targetUrl.searchParams.set("page", String(currentPage));
	if (cacheBust) {
		targetUrl.searchParams.set("v", cacheBust);
	}
	let raw: ThreadListType;
	try {
		raw = await BffFetcher<ThreadListType>(targetUrl, {
			method: "GET",
			cache: "force-cache",
			next: { revalidate, tags: ["threads"] },
			skipCookie: true,
		});
	} catch (error: unknown) {
		const fetchError = error as BffFetcherError;
		if (fetchError.status === 404) {
			return notFound();
		}
		console.error("Failed to fetch threads", fetchError);
		raw = { threads: [], totalCount: 0 };
	}

	const safeResponse = {
		threads: Array.isArray(raw?.threads) ? raw.threads : [],
		totalCount: typeof raw?.totalCount === "number" ? raw.totalCount : 0,
	};

	const threadsResponse: ThreadListType = ThreadListSchema.parse(safeResponse);
	const threads: ThreadType[] = threadsResponse.threads;

	const totalCount: number = threadsResponse.totalCount;

	return (
		<div className="px-2 sm:px-5">
			<ThreadPageClient
				initialThreads={threads}
				currentPage={currentPage}
				totalCount={totalCount}
			/>
		</div>
	);
}
