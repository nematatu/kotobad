import { ThumbsUp } from "lucide-react";
import Link from "next/link";
import IconButton from "@/components/common/button/IconButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "../../provider/UserProvider";
import UserAvatar from "../UserAvatar";

export function UserPopover() {
	const { user } = useUser();
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button click className="relative h-8 w-8">
					<UserAvatar />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 mt-4 p-0 overflow-hidden">
				<div className="bg-blue-50 px-4 py-3">
					<Link href="/profile">
						<div className="text-lg">{user?.name}</div>
					</Link>
				</div>
				<IconButton icon={<ThumbsUp />}>Like</IconButton>
			</PopoverContent>
		</Popover>
	);
}
