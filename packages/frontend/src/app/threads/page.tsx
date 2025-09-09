import { getAllThreads } from "@/lib/api/threads";
import { ThreadList } from "./components/threads/ThreadList";
import { ThreadListSchema } from "@b3s/shared/src/schemas/thread";

export default async function Page() {
	const res = await getAllThreads();
	if ("error" in res) {
		return <div>Server Error</div>;
	}
	const threads = ThreadListSchema.parse(res);
	return <ThreadList threads={threads} />;
}
