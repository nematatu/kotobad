"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import GoogleOAuth from "@/components/feature/button/auth/googleOAuth";
import type { UserState } from "@/components/feature/provider/UserProvider";
import { UserPopover } from "@/components/feature/user/popover/UserPopover";
import CreateThreadDialog from "./createThreadDialog";

type Props = {
	isLoading: boolean;
	user: UserState;
	tags: TagType[];
	showCreate?: boolean;
	showUserPopover?: boolean;
};

const HeaderUserActions = ({
	isLoading,
	user,
	tags,
	showCreate = true,
	showUserPopover = true,
}: Props) => {
	if (isLoading) {
		return (
			<div
				className="h-8 w-24 rounded-md bg-gray-200 animate-pulse"
				aria-hidden="true"
			/>
		);
	}

	if (user) {
		const hasActions = showCreate || showUserPopover;
		if (!hasActions) {
			return null;
		}

		return (
			<div className="flex items-center gap-2 sm:gap-7">
				{showUserPopover ? <UserPopover /> : null}
				{showCreate ? (
					<div className="flex">
						<CreateThreadDialog tags={tags} />
					</div>
				) : null}
			</div>
		);
	}

	return <GoogleOAuth />;
};

export default HeaderUserActions;
