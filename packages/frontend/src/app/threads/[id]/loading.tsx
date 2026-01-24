import { Skeleton } from "@/components/ui/skeleton";

const POST_PLACEHOLDER_ITEMS = Array.from({ length: 6 }, (_, index) => ({
	id: `post-skeleton-${index}`,
}));

export default function Loading() {
	return (
		<div className="p-1 sm:p-4 pb-40">
			<div className="pl-3">
				<Skeleton className="h-4 w-28" />
			</div>

			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col w-full items-center p-4 sm:py-7 space-y-3">
					<Skeleton className="h-7 w-2/3 sm:h-9 sm:w-1/2" />
					<div className="mt-2 flex flex-wrap justify-center gap-2">
						<Skeleton className="h-5 w-12 rounded-full" />
						<Skeleton className="h-5 w-16 rounded-full" />
						<Skeleton className="h-5 w-10 rounded-full" />
					</div>
					<Skeleton className="h-4 w-32" />
				</div>

				<div className="w-full sm:w-1/2 space-y-2">
					{POST_PLACEHOLDER_ITEMS.map((item, index) => (
						<div
							key={item.id}
							className={`p-4 min-h-14 flex items-center border ${
								index % 2 === 0 ? "bg-gray-100 dark:bg-gray-950" : ""
							}`}
						>
							<div className="flex-col flex sm:flex-row justify-between text-sm sm:text-base w-full space-y-2">
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-6" />
									<Skeleton className="h-6 w-6 rounded-full" />
									<Skeleton className="h-4 w-24" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-5/6" />
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="fixed inset-x-0 bottom-0 px-3 pb-3 sm:px-4 sm:pb-4">
				<div className="max-w-2xl mx-auto">
					<div className="w-full rounded-xl border bg-card text-card-foreground shadow">
						<div className="p-4 space-y-3">
							<div className="flex items-center justify-between">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-5 w-5 rounded-md" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-20 w-full rounded-xl" />
									<Skeleton className="h-4 w-40" />
								</div>
							</div>
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
