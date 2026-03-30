"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import { useEffect, useState } from "react";
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
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated || isLoading) {
		return (
			<div
				className="flex items-center justify-center gap-2 sm:gap-7"
				aria-hidden="true"
			>
				<div className="size-8 rounded-full bg-gray-200 animate-pulse sm:size-9 dark:bg-slate-800" />
				<div className="hidden rounded-full bg-gray-200 animate-pulse [@media(min-width:496px)]:block [@media(min-width:496px)]:size-9 dark:bg-slate-800" />
				<div className="hidden h-9 w-36 rounded-full bg-gray-200 animate-pulse md:block dark:bg-slate-800" />
			</div>
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
