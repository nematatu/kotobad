"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseSort, sortLabel, sortOptions } from "@/app/threads/lib/sort";

export function SortSelect() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentSort = parseSort(searchParams.get("sort"));

	const handleChange = (value: string) => {
		const sort = parseSort(value);
		const params = new URLSearchParams(searchParams);
		params.set("sort", sort);
		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div>
			<select
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
