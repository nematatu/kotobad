import type { TagType } from "@kotobad/shared/src/types/tag";
import { useEffect, useMemo, useState } from "react";
import Tag from "@/components/common/tag/Tag";
import TagIcon from "@/components/common/tag/TagIcon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
	tags: TagType[];
	selectedTagIds: number[];
	onSelect: (id: number, isSelected: boolean) => void;
	isOpen?: boolean;
};

export const TagPicker = ({
	tags,
	selectedTagIds,
	onSelect,
	isOpen,
}: Props) => {
	const [query, setQuery] = useState("");
	const [hoveredTagId, setHoveredTagId] = useState<number | null>(null);

	const tagById = useMemo(
		() => new Map(tags.map((tag) => [tag.id, tag])),
		[tags],
	);

	const hoveredTag = useMemo(
		() => (hoveredTagId == null ? null : (tagById.get(hoveredTagId) ?? null)),
		[hoveredTagId, tagById],
	);
	const hoveredTagIcon = hoveredTag ? (
		<TagIcon tag={hoveredTag} variant="picker" size={20} fit fallback />
	) : null;

	const filteredTags = useMemo(() => {
		const trimmed = query.trim().toLowerCase();
		if (!trimmed) {
			return tags;
		}

		return tags.filter((tag) => tag.name.toLowerCase().includes(trimmed));
	}, [query, tags]);

	useEffect(() => {
		if (!isOpen) {
			setQuery("");
		}
	}, [isOpen]);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="タグを検索"
					className="h-8 text-xs"
				/>
				<span className="text-[10px] text-slate-500">
					{filteredTags.length}件
				</span>
			</div>

			{filteredTags.length === 0 ? (
				<div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-500">
					該当するタグがありません
				</div>
			) : (
				<TooltipProvider delayDuration={0}>
					<ScrollArea className="h-60">
						<div className="flex flex-wrap gap-0 p-1">
							{filteredTags.map((tag) => {
								const isSelected = selectedTagIds.includes(tag.id);
								return (
									<Tooltip key={tag.id}>
										<TooltipTrigger asChild>
											<Tag
												tag={tag}
												isViewLabel={false}
												type="button"
												onClick={() => onSelect(tag.id, isSelected)}
												onMouseEnter={() => setHoveredTagId(tag.id)}
												onMouseLeave={() =>
													setHoveredTagId((prev) =>
														prev === tag.id ? null : prev,
													)
												}
												onFocus={() => setHoveredTagId(tag.id)}
												onBlur={() =>
													setHoveredTagId((prev) =>
														prev === tag.id ? null : prev,
													)
												}
												className={cn(
													"group m-0 flex h-auto flex-col items-center rounded-xl border border-transparent p-0 text-slate-600 transition",
													"hover:border-slate-200 hover:bg-yellow-200",
													isSelected &&
														"border-blue-300 bg-blue-50 text-blue-700",
												)}
											/>
										</TooltipTrigger>
										<TooltipContent>{tag.name}</TooltipContent>
									</Tooltip>
								);
							})}
						</div>
					</ScrollArea>
					<div className="h-12 flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 overflow-hidden">
						{hoveredTag && (
							<div className="flex gap-1.5 font-medium">
								<span className="flex h-10 w-10 items-center justify-center shadow-xs ring-1 ring-slate-200/70">
									{hoveredTagIcon}
								</span>
								<span className="truncate text-md">{hoveredTag.name}</span>
							</div>
						)}
					</div>
				</TooltipProvider>
			)}
		</div>
	);
};
