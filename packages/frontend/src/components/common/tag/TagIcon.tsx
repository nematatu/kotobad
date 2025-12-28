import type { TagType } from "@kotobad/shared/src/types/tag";
import Image from "next/image";
import getTagAssetsUrl from "@/lib/config/tag/getTagAssetsUrl";
import { cn } from "@/lib/utils";

type TagIconProps = {
	tag: TagType;
	size?: number;
	variant?: "default" | "picker";
	fallback?: boolean;
	className?: string;
	fit?: boolean;
};

const variantClasses = {
	default: {
		emoji: "text-lg leading-none",
		text: "text-xs leading-none",
		fallback: "text-xs text-slate-400",
	},
	picker: {
		emoji: "text-base leading-none",
		text: "text-xs font-semibold",
		fallback: "text-xs text-slate-400",
	},
};

export default function TagIcon({
	tag,
	size = 20,
	variant = "default",
	fallback = false,
	className,
	fit = false,
}: TagIconProps) {
	const classes = variantClasses[variant];
	const fitStyle = fit ? { fontSize: size, lineHeight: 1 } : undefined;
	const imageClassName = cn(fit && "h-full w-full object-contain", className);

	if (tag.iconType === "image") {
		return (
			<Image
				src={getTagAssetsUrl(tag.iconValue)}
				alt={tag.name}
				width={size}
				height={size}
				className={imageClassName}
			/>
		);
	}

	if (tag.iconType === "emoji") {
		return (
			<span className={cn(classes, className)} style={fitStyle}>
				{tag.iconValue}
			</span>
		);
	}

	if (tag.iconType === "text") {
		return (
			<span className={cn(classes, className)} style={fitStyle}>
				{tag.iconValue}
			</span>
		);
	}

	if (fallback) {
		return (
			<span className={cn(classes.fallback, className)} style={fitStyle}>
				#
			</span>
		);
	}

	return null;
}
