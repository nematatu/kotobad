import type { TagType } from "@kotobad/shared/src/types/tag";
import Tag from "@/components/common/tag/Tag";

type Props = {
	tags: TagType[];
	onToggle?: (id: number) => void;
};

export const TagList = ({ tags, onToggle }: Props) => {
	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => {
				return (
					<Tag
						key={tag.id}
						tag={tag}
						variant="tag"
						size="sm"
						onClick={onToggle ? () => onToggle(tag.id) : undefined}
						className={onToggle ? "cursor-pointer" : undefined}
					/>
				);
			})}
		</div>
	);
};
