import { ThreadList } from "./components/view/threads/threadList";
import { getThreads } from "./threads/lib/getThread";

export default async function Page() {
	const { threads } = await getThreads(1);
	return (
		<div className="flex flex-col gap-y-4 mx-40">
			<h1 className="text-4xl font-bold">人気のスレッド</h1>
			<h1 className="text-4xl font-bold">最新のスレッド</h1>
			<ThreadList threads={threads} />
		</div>
	);
}
