import {
	ArchiveIcon,
	ArrowRightIcon,
	CopyIcon,
	EllipsisVerticalIcon,
	FolderIcon,
	LinkIcon,
	PencilIcon,
	Share2Icon,
	StarIcon,
	TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Pattern() {
	return (
		<div className="flex items-center justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon">
						<EllipsisVerticalIcon aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-48" align="end">
					<DropdownMenuGroup>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>
							<PencilIcon aria-hidden="true" />
							Edit
							<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<CopyIcon aria-hidden="true" />
							Duplicate
							<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<ArrowRightIcon aria-hidden="true" />
								Move to
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>
										<FolderIcon aria-hidden="true" />
										Projects
									</DropdownMenuItem>
									<DropdownMenuItem>
										<ArchiveIcon aria-hidden="true" />
										Archive
									</DropdownMenuItem>
									<DropdownMenuItem>
										<StarIcon aria-hidden="true" />
										Favorites
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<Share2Icon aria-hidden="true" />
							Share
						</DropdownMenuItem>
						<DropdownMenuItem>
							<LinkIcon aria-hidden="true" />
							Copy Link
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive">
						<TrashIcon aria-hidden="true" />
						Delete
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
