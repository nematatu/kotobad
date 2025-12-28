import type { TagType } from "@kotobad/shared/src/types/tag";
import type * as React from "react";
import IconButton from "@/components/common/button/IconButton";
import TagIcon from "@/components/common/tag/TagIcon";

type TagProps = {
	tag: TagType;
	isViewLabel?: boolean;
} & Omit<React.ComponentProps<typeof IconButton>, "icon" | "children">;

export default function Tag({
	tag,
	isViewLabel = true,
	...buttonProps
}: TagProps) {
	const { name } = tag;
	const icon = <TagIcon tag={tag} />;

	const iconNode = isViewLabel ? (
		icon
	) : (
		<span className="flex h-9 w-9 items-center justify-center">{icon}</span>
	);

	return (
		<IconButton
			enableClickAnimation
			variant="outline"
			icon={iconNode}
			size="icon"
			{...buttonProps}
		>
			{isViewLabel && <span>{name}</span>}
		</IconButton>
	);
}
