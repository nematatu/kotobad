import { CategoryColorMap } from "@/lib/config/color/labelColor";
import { cn } from "@/lib/utils";

type TagOption = {
	id: number;
	name: string;
};

type Props = {
	tags: TagOption[];
	selectedTagIds?: number[];
	onToggle?: (id: number) => void;
};

const getLabelClass = (labelId: number) =>
	CategoryColorMap[labelId % CategoryColorMap.length];

export const TagList = ({ tags, selectedTagIds, onToggle }: Props) => {
	const selected = selectedTagIds ?? [];
	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => {
				const isSelected = selected.includes(tag.id);
				const classes = cn(
					"rounded-full px-3 py-1 text-xs font-medium text-gray-800 transition",
					getLabelClass(tag.id),
					onToggle
						? isSelected
							? "ring-2 ring-blue-500 ring-offset-1"
							: "opacity-70 hover:opacity-100"
						: undefined,
				);

				if (!onToggle) {
					return (
						<span key={tag.id} className={classes}>
							{tag.name}
						</span>
					);
				}

				return (
					<button
						key={tag.id}
						type="button"
						onClick={() => onToggle(tag.id)}
						className={classes}
					>
						{tag.name}
					</button>
				);
			})}
		</div>
	);
};
