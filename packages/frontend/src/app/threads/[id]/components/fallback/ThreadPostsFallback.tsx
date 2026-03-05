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
		</div>
	);
};
