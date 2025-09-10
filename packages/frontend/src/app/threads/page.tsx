import { getAllThreads } from "@/lib/api/threads";
import { ThreadListSchema } from "@b3s/shared/src/schemas/thread";
import ThreadPageClient from "./components/threads/ThreadPageClient";

export default async function Page() {
	const res = await getAllThreads();
	if ("error" in res) {
		return <div>Server Error</div>;
	}
	const threads = ThreadListSchema.parse(res);
	return (
		<div className="px-5">
			<ThreadPageClient initialThreads={threads} />
		</div>
	);
}
