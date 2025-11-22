import { ThreadListSchema } from "@kotobad/shared/src/schemas/thread";
import type {
	ThreadListType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import ThreadPageClient from "./components/view/ThreadPageClient";
export const revalidate = 900;

export type Props = {
	searchParams?: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
	const params = searchParams ? await searchParams : {};
	const currentPage = Number(params?.page ?? "1");

	const targetUrl = await getBffApiUrl("GET_ALL_THREADS");
	targetUrl.searchParams.set("page", String(currentPage));

	const response = await fetch(targetUrl, {
		cache: "force-cache",
		next: { revalidate, tags: ["threads"] },
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch threads: ${response.status} ${response.statusText}`,
		);
	}

	const raw: ThreadListType = await response.json();

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
