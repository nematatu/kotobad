import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_POSTS = Array.from({ length: 4 }, (_, index) => ({
	id: `post-skeleton-${index}`,
}));

export const ThreadPostsFallback = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="w-full space-y-3 sm:w-1/2">
				{PLACEHOLDER_POSTS.map((item) => (
					<div key={item.id} className="space-y-3 border p-4">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-24" />
					</div>
				))}
			</div>
			<div className="fixed inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4">
				<div className="mx-auto max-w-2xl">
					<Skeleton className="h-16 w-full" />
				</div>
			</div>
		</div>
	);
};
