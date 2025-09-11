import { getAllThreads } from "@/lib/api/threads";
import { ThreadListSchema } from "@b3s/shared/src/schemas/thread";
import ThreadPageClient from "./components/threads/ThreadPageClient";

type Props = {
	searchParams?: { page?: string };
};

export default async function Page({ searchParams }: Props) {
	const currentPage = Number(searchParams?.page ?? "1");

	const res = await getAllThreads(currentPage);
	if ("error" in res) {
		return <div>Server Error</div>;
	}

	const threads = ThreadListSchema.parse(res).threads;
	return (
		<div className="px-5">
			<ThreadPageClient initialThreads={threads} currentPage={currentPage} />
		</div>
	);
}
