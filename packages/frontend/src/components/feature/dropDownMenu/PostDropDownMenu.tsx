import { Copy, EllipsisVerticalIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { PiXLogo } from "react-icons/pi";
import { toast } from "sonner";
import lineIcon from "@/assets/icons/line.png";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropDownMenuProps = {
	postId: number;
};

export function PostDropDownMenu({ postId }: DropDownMenuProps) {
	const urlCopyHandler = async () => {
		if (typeof window === "undefined") return;

		try {
			const url = new URL(window.location.href);
			url.searchParams.set("postId", String(postId));
			const copiedUrl = url.toString();
			await navigator.clipboard.writeText(copiedUrl);
			toast.success("コピーしました", {
				description: (
					<a
						href={copiedUrl}
						target="_blank"
						rel="noreferrer noopener"
						className="block max-w-[70vw] overflow-hidden text-ellipsis whitespace-nowrap text-blue-600 underline underline-offset-2 hover:text-blue-500 sm:max-w-[420px]"
						title={copiedUrl}
					>
						{copiedUrl}
					</a>
				),
			});
		} catch (_e) {
			toast.error("コピーに失敗しました");
		}
	};
	return (
		<div className="flex items-center justify-center">
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="投稿メニューを開く">
						<EllipsisVerticalIcon size={10} aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-48"
					align="end"
					onCloseAutoFocus={(event) => {
						event.preventDefault();
					}}
				>
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Share2Icon aria-hidden="true" />
								共有
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem onClick={urlCopyHandler}>
										<Copy aria-hidden="true" />
										コピー
									</DropdownMenuItem>
									<DropdownMenuItem>
										<PiXLogo
											className="w-6 h-6 bg-black text-white"
											aria-hidden="true"
										/>
										X
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Image
											src={lineIcon.src}
											alt=""
											aria-hidden="true"
											width={20}
											height={20}
											className="h-5 w-5"
										/>
										LINE
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
