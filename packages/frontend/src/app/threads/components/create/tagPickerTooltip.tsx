import type { TagType } from "@kotobad/shared/src/types/tag";
import { SmilePlus, X } from "lucide-react";
import { useState } from "react";
import IconButton from "@/components/common/button/IconButton";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TagPicker } from "../view/tag/tagPicker";

type TagPickerTooltipProps = {
	onSelect: (id: number, isSelected: boolean) => void;
	tags: TagType[];
	selectedTagIds: number[];
};

export function TagPickerTooltip({
	onSelect,
	tags,
	selectedTagIds,
}: TagPickerTooltipProps) {
	const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

	return (
		<Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
			<TooltipProvider delayDuration={3}>
				<Tooltip>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<IconButton
								enableClickAnimation
								type="button"
								size="icon"
								variant="outline"
								className="group h-10 w-10 rounded-full border-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
								icon={
									<SmilePlus className="h-5 w-5 text-slate-600 transition-colors group-hover:fill-yellow-300" />
								}
							/>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>タグを追加</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<PopoverContent
				align="start"
				className="w-[360px] rounded-xl border-0 bg-white p-4"
				side="bottom"
				sideOffset={8}
			>
				<div className="flex items-center justify-between">
					<div className="text-sm font-semibold">タグを選択</div>
					<div className="flex items-center gap-2">
						<span className="text-xs text-slate-400">
							{selectedTagIds.length} 件選択中
						</span>
						<IconButton
							enableClickAnimation
							icon={<X className="h-5 w-5 text-slate-600" />}
							onClick={() => setIsTagPopoverOpen(false)}
							className="h-8 w-8 bg-transparent border-0 hover:bg-slate-100"
							aria-label="タグ選択を閉じる"
						/>
					</div>
				</div>
				<p className="mt-1 text-xs text-gray-500">
					クリックで追加/解除できます
				</p>
				<div className="mt-3">
					<TagPicker
						tags={tags}
						selectedTagIds={selectedTagIds}
						onSelect={onSelect}
						isOpen={isTagPopoverOpen}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
