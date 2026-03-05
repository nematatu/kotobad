import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_POSTS = Array.from({ length: 4 }, (_, index) => ({
	id: `post-skeleton-${index}`,
}));

export const ThreadPostsFallback = () => {
	return (
		<div className="rounded-lg bg-white p-2 sm:pb-4 flex flex-col">
			{PLACEHOLDER_POSTS.map((item) => (
				<div
					key={item.id}
					className="px-4 py-2 md:py-3 min-h-14 flex items-center border-b-[0.7px] border-slate-400"
				>
					<div className="flex flex-col w-full gap-2">
						<div className="flex w-full items-center gap-2">
							<Skeleton className="h-4 w-4 rounded-full md:h-7 md:w-7" />
							<Skeleton className="h-3 w-16" />
						</div>
						<Skeleton className="h-6 w-[92%]" />
					</div>
				</div>
			))}
		</div>
	);
};
