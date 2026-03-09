import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/common/Link";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import LogoutButton from "../../button/auth/logoutButton";
import { useUser } from "../../provider/UserProvider";
import UserAvatar from "../UserAvatar";

type Props = {
	onProfileNavigate?: () => void;
};

export function UserPopover({ onProfileNavigate }: Props) {
	const { user } = useUser();
	const [open, setOpen] = useState(false);
	const profileHref = user?.id
		? `/users/${encodeURIComponent(user.id)}`
		: "/threads";
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					enableClickAnimation
					variant="ghost"
					size="icon"
					className="relative size-8 rounded-full bg-transparent p-0 sm:size-10"
				>
					<UserAvatar />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 mt-4 p-0 overflow-hidden">
				<Link
					href={profileHref}
					onNavigate={() => {
						setOpen(false);
						onProfileNavigate?.();
					}}
				>
					<div className="bg-blue-50 px-4 py-2">
						<div className="flex justify-between">
							<div className="text-lg">{user?.name}</div>
							<ArrowUpRight className="text-gray-400 w-4" />
						</div>
					</div>
				</Link>
				<div className="flex py-4 items-center justify-center">
					<LogoutButton />
				</div>
			</PopoverContent>
		</Popover>
	);
}
