import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadCrumbType = {
	currentThreadTitle: string;
	size?: "sm" | "md" | "lg";
};

export default function BreadCrumb({
	currentThreadTitle,
	size = "md",
}: BreadCrumbType) {
	const sizeClasses = {
		sm: "text-xs gap-1.5 [&>li]:gap-1.5",
		md: "text-sm gap-2 [&>li]:gap-2",
		lg: "text-base gap-3 [&>li]:gap-3",
	};

	return (
		<Breadcrumb>
			<BreadcrumbList className={`${sizeClasses.sm} sm:${sizeClasses[size]}`}>
				<BreadcrumbItem>
					<BreadcrumbLink href="/threads">スレッド一覧</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem className="hidden sm:block">
					<BreadcrumbPage>{currentThreadTitle}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
