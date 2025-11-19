import { Skeleton } from "@/components/ui/skeleton";

const POST_PLACEHOLDER_ITEMS = Array.from({ length: 6 }, (_, index) => ({
	id: `post-skeleton-${index}`,
}));

export default function Loading() {
	return (
		<div className="p-3 sm:p-6 space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-8 w-2/3" />
				<Skeleton className="h-4 w-40" />
			</div>
			<div className="space-y-4">
				{POST_PLACEHOLDER_ITEMS.map((item) => (
					<div key={item.id} className="border rounded-md p-4 space-y-3">
						<Skeleton className="h-4 w-1/3" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-20 w-full" />
					</div>
				))}
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-40" />
				<Skeleton className="h-32 w-full" />
				<div className="flex justify-end">
					<Skeleton className="h-10 w-32" />
				</div>
			</div>
		</div>
	);
}
