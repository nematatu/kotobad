import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const PLACEHOLDER_THREAD_ITEMS = [
	{
		id: "thread-skeleton-1",
		depth: 0,
		bodyWidthClassName: "w-[86%]",
		subBodyWidthClassName: "w-[52%]",
	},
	{
		id: "thread-skeleton-2",
		depth: 0,
		bodyWidthClassName: "w-[82%]",
		subBodyWidthClassName: "w-[46%]",
	},
	{
		id: "thread-skeleton-3",
		depth: 1,
		bodyWidthClassName: "w-[78%]",
		subBodyWidthClassName: "w-[42%]",
	},
];

const renderCreatePostFormSkeleton = () => {
	return (
		<div className="w-full min-w-0 rounded-full border border-slate-200 bg-gray-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900">
			<div className="flex items-center gap-2">
				<div className="mt-0.5 shrink-0">
					<Skeleton className="h-7 w-7 rounded-full bg-[#dbe4ee] dark:bg-[#334155] sm:h-10 sm:w-10" />
				</div>
				<div className="shrink-0">
					<div className="flex h-9 w-9 items-center justify-center rounded-md">
						<Skeleton className="h-4 w-4 rounded-sm bg-[#dbe4ee] dark:bg-[#334155]" />
					</div>
				</div>
				<Skeleton className="h-[34px] flex-1 rounded-md bg-[#e5e7eb] dark:bg-[#334155]" />
				<Skeleton className="h-9 w-9 rounded-full bg-[#bfdbfe] dark:bg-[#1e40af]" />
			</div>
		</div>
	);
};

export const ThreadPostsFallback = () => {
	return (
		<div className="space-y-3">
			<div className="px-4 pb-2 pt-4">{renderCreatePostFormSkeleton()}</div>
			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
				{PLACEHOLDER_THREAD_ITEMS.map((item, index) => (
					<div
						key={item.id}
						className={cn(
							"relative px-3 py-3 sm:px-4",
							index > 0
								? "border-slate-300 border-t dark:border-slate-800"
								: undefined,
						)}
						style={
							item.depth > 0
								? {
										marginInlineStart: `${Math.min(item.depth, 8) * 22}px`,
									}
								: undefined
						}
					>
						<div className="space-y-2">
							<Skeleton
								className={cn(
									"h-4 rounded bg-[#e2e8f0] dark:bg-[#334155]",
									item.bodyWidthClassName,
								)}
							/>
							<Skeleton
								className={cn(
									"h-4 rounded bg-[#e2e8f0] dark:bg-[#334155]",
									item.subBodyWidthClassName,
								)}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
