import TrendingThreadList from "@/app/components/TrendingThreadList";
import { getTrendingThreads } from "@/app/threads/lib/getTrendingThreads";

export default async function Page() {
	const { threads } = await getTrendingThreads({ limit: 8 });

	return (
		<div className="flex flex-col gap-y-4 max-w-5xl mx-auto p-4">
			<section className="space-y-2">
				<h2 className="text-2xl font-bold text-slate-700">トレンド</h2>
				{threads.length > 0 ? (
					<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
						<TrendingThreadList threads={threads} />
					</div>
				) : (
					<div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
						表示できるトレンドスレッドはまだありません。
					</div>
				)}
			</section>
		</div>
	);
}
