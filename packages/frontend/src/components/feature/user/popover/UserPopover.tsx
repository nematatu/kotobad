import { ArrowUpRight } from "lucide-react";
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

export function UserPopover() {
	const { user } = useUser();
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button enableClickAnimation className="relative h-8 w-8">
					<UserAvatar />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 mt-4 p-0 overflow-hidden">
				<Link href="/profile">
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
