"use client";

import { formatDate } from "@kotobad/shared/src/utils/date/formatDate";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getThreadPreview } from "@/lib/cache/threadPreview";
import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";
import BreadCrumb from "./BreadCrumbs";

type Props = {
	children: ReactNode;
};

const getLabelClass = (tagId: number) =>
	CategoryColorMap[tagId % CategoryColorMap.length];

export default function ThreadDetailLoadingShell({ children }: Props) {
	const params = useParams<{ id?: string | string[] }>();
	const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
	const preview = getThreadPreview(id);

	if (!preview) {
		return (
			<>
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
					<div className="w-full sm:w-1/2">{children}</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="pl-3">
				<BreadCrumb currentThreadTitle={preview.title} />
			</div>
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col w-full items-center p-4 sm:py-7">
					<div className="text-xl sm:text-3xl font-bold break-words">
						{preview.title}
					</div>
					{preview.threadTags?.length ? (
						<div className="mt-2 flex flex-wrap justify-center gap-2">
							{preview.threadTags.map((tag) => (
								<span
									key={tag.tagId}
									className={cn(
										"rounded-full px-2 py-0.5 text-xs font-medium text-gray-800",
										getLabelClass(tag.tagId),
									)}
								>
									{tag.tags.name}
								</span>
							))}
						</div>
					) : null}
					<p className="text-gray-400">{formatDate(preview.createdAt)}</p>
				</div>
				<div className="w-full sm:w-1/2">{children}</div>
			</div>
		</>
	);
}
