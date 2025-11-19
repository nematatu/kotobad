import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_ITEMS = Array.from({ length: 5 }, (_, index) => ({
	id: `thread-skeleton-${index}`,
}));

export default function Loading() {
	return (
		<div className="px-2 sm:px-5 py-4 flex justify-center">
			<div className="w-full sm:max-w-[50%] space-y-4">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-12 w-full" />
				</div>
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="space-y-3">
					{PLACEHOLDER_ITEMS.map((item) => (
						<div key={item.id} className="border rounded-md p-4 space-y-3">
							<Skeleton className="h-6 w-3/4" />
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-16" />
							</div>
							<Skeleton className="h-4 w-32" />
						</div>
					))}
				</div>
				<div className="flex justify-end space-x-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</div>
			</div>
		</div>
	);
}
