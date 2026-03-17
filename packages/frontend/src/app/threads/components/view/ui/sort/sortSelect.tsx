"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { parseSort, sortLabel, sortOptions } from "@/app/threads/lib/sort";
import { viewTransitionKeys } from "@/config/viewTransition";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";

export function SortSelect() {
	const router = useViewTransitionRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentSort = parseSort(searchParams.get("sort"));
	const selectId = "thread-sort-select";

	const handleChange = (value: string) => {
		const sort = parseSort(value);
		const params = new URLSearchParams(searchParams);
		params.set("sort", sort);
		router.replace(`${pathname}?${params.toString()}`, {
			viewTransitionKey: viewTransitionKeys.threadListQueryControls,
		});
	};

	return (
		<div>
			<label htmlFor={selectId} className="sr-only">
				並び順
			</label>
			<select
				id={selectId}
				name="sort"
				aria-label="並び順"
				value={currentSort}
				onChange={(e) => handleChange(e.target.value)}
				className="h-9 rounded-md px-3 text-sm font-semibold text-slate-700 outline-none"
			>
				{sortOptions.map((value) => (
					<option value={value} key={value}>
						{sortLabel[value]}
					</option>
				))}
			</select>
		</div>
	);
}
