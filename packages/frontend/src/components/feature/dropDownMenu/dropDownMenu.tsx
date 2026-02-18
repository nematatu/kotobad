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

export function DropDownMenu() {
	return (
		<div className="flex items-center justify-center">
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" aria-label="投稿メニューを開く">
						<EllipsisVerticalIcon aria-hidden="true" />
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
									<DropdownMenuItem
										onClick={() => toast.success("コピーしました")}
									>
										<Copy aria-hidden="true" />
										コピー
									</DropdownMenuItem>
									<DropdownMenuItem>
										<PiXLogo
											className="w-6 h-6 rounded-full bg-black text-white"
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
