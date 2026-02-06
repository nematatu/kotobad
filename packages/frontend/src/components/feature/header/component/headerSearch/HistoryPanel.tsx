"use client";

import { Link } from "@/components/common/Link";
import { cn } from "@/lib/utils";

type Props = {
	items: { query: string; at: number }[];
	onSelect: (query: string) => void;
	onRemove: (query: string) => void;
	onClear: () => void;
	className?: string;
};

const HistoryPanel = ({
	items,
	onSelect,
	onRemove,
	onClear,
	className,
}: Props) => {
	return (
		<div
			className={cn(
				"absolute left-0 right-0 top-full mt-2 rounded-sm border border-slate-200 bg-white text-slate-900 shadow-lg animate-fade-in-up z-[70]",
				className,
			)}
		>
			<div className="flex items-center justify-between px-3 pt-3 text-xs text-slate-500">
				<span>検索履歴</span>
				<button
					type="button"
					onMouseDown={(event) => event.preventDefault()}
					onClick={onClear}
					className="text-slate-500 hover:text-slate-700"
				>
					全削除
				</button>
			</div>
			<div className="flex max-h-[50vh] flex-col overflow-y-auto">
				{items.length === 0 ? (
					<div className="px-3 py-3 text-xs text-slate-500">
						履歴がありません
					</div>
				) : (
					items.map((item) => (
						<div
							key={`${item.query}-${item.at}`}
							className="flex items-center gap-2 border-t border-slate-200 px-3 py-2 first:border-t-0"
						>
							<Link
								href={`/threads?q=${encodeURIComponent(item.query)}`}
								className="min-w-0 flex-1 text-sm text-slate-900 truncate hover:underline"
								onPointerDown={(event) => event.preventDefault()}
								onClick={(event) => {
									onSelect(item.query);
									const form = event.currentTarget.closest("form");
									const input = form?.querySelector("input");
									if (input instanceof HTMLInputElement) input.blur();
								}}
							>
								{item.query}
							</Link>
							<button
								type="button"
								onMouseDown={(event) => event.preventDefault()}
								onClick={() => onRemove(item.query)}
								className="text-xs text-slate-400 hover:text-slate-600"
							>
								削除
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default HistoryPanel;
