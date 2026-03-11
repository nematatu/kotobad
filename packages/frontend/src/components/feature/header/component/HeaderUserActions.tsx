"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import type { UserState } from "@/components/feature/provider/UserProvider";
import { UserPopover } from "@/components/feature/user/popover/UserPopover";
import CreateThreadDialog from "./createThreadDialog";
import { NotificationBell } from "./notification/NotificationBell";

type Props = {
	isLoading: boolean;
	user: UserState;
	tags: TagType[];
};

const HeaderUserActions = ({ isLoading, user, tags }: Props) => {
	if (isLoading) {
		return (
			<div
				className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"
				aria-hidden="true"
			/>
		);
	}

	if (user) {
		return (
			<div className="flex items-center justify-center gap-2 sm:gap-7">
				<NotificationBell />
				<div className="flex items-center justify-center [@media(max-width:767px)]:hidden">
					<UserPopover />
				</div>
				<div className="hidden [@media(min-width:496px)]:block">
					<CreateThreadDialog tags={tags} />
				</div>
			</div>
		);
	}

	return <GoogleOAuth />;
};

export default HeaderUserActions;
