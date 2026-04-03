import Image, { type ImageLoaderProps } from "next/image";
import { cn } from "@/lib/utils";
import { toCfImageUrl } from "@/lib/utils/cfImage";

type Props = {
	headerImage: string | null;
	alt: string;
	sizes: string;
	className?: string;
	fallbackClassName?: string;
};

const HEADER_OUTPUT_WIDTH = 1800;
const HEADER_OUTPUT_HEIGHT = 450;

const profileHeaderLoader = ({ src, width, quality }: ImageLoaderProps) =>
	toCfImageUrl(src, {
		width,
		quality: quality ?? 72,
		fit: "cover",
	}) ?? src;

export function ProfileHeaderImage({
	headerImage,
	alt,
	sizes,
	className,
	fallbackClassName,
}: Props) {
	if (!headerImage) {
		return (
			<div
				className={cn(
					"w-full bg-[linear-gradient(135deg,#76b8ff_0%,#86a8ff_25%,#7edac4_100%)]",
					fallbackClassName,
				)}
				style={{
					aspectRatio: `${HEADER_OUTPUT_WIDTH} / ${HEADER_OUTPUT_HEIGHT}`,
				}}
			/>
		);
	}

	return (
		<Image
			loader={profileHeaderLoader}
			src={headerImage}
			alt={alt}
			sizes={sizes}
			quality={72}
			width={HEADER_OUTPUT_WIDTH}
			height={HEADER_OUTPUT_HEIGHT}
			className={cn("block h-auto w-full", className)}
		/>
	);
}
