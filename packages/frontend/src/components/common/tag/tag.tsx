import type { TagType } from "@kotobad/shared/src/types/tag";
import Image from "next/image";
import IconButton from "@/components/common/button/IconButton";
import getTagAssetsUrl from "@/lib/config/tag/getTagAssetsUrl";

export default function Tag({ tag }: { tag: TagType }) {
	const { name, iconType, iconValue } = tag;
	const icon =
		iconType === "image" ? (
			<Image
				src={getTagAssetsUrl(iconValue)}
				alt={name}
				width={20}
				height={20}
			/>
		) : iconType === "emoji" ? (
			<span className="text-lg leading-none">{iconValue}</span>
		) : iconType === "text" ? (
			<span className="text-xs leading-none">{iconValue}</span>
		) : null;

	return (
		<IconButton enableClickAnimation variant="outline" icon={icon}>
			{name}
		</IconButton>
	);
}
