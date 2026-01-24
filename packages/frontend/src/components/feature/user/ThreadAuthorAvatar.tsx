import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ThreadAuthorAvatarProps = {
	name: string | null;
	image: string | null | undefined;
	className: string;
	fallbackClassName?: string;
};

export default function ThreadAuthorAvatar({
	name,
	image,
	className,
	fallbackClassName,
}: ThreadAuthorAvatarProps) {
	const resolvedName = name ?? null;
	const resolvedImage = image ?? null;

	const fallbackText = resolvedName?.trim().charAt(0) ?? "?";
	return (
		<Avatar
			className={cn("h-10 w-10 bg-white border border-blue-400", className)}
		>
			{resolvedImage && (
				<AvatarImage src={resolvedImage} alt={resolvedName ?? ""} />
			)}
			<AvatarFallback
				className={cn(
					"bg-gray-400 text-[10px] font-bold text-white",
					fallbackClassName,
				)}
			>
				{fallbackText.toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
