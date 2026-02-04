"use client";

import type { TagType } from "@kotobad/shared/src/types/tag";
import CreateThreadFabButton from "@/components/feature/button/thread/createThreadFab";
import CreateThreadDialog from "@/components/feature/header/component/createThreadDialog";
import { useUser } from "@/components/feature/provider/UserProvider";

type Props = {
	tags: TagType[];
};

export default function FloatingCreateThread({ tags }: Props) {
	const { user, isLoading } = useUser();

	if (isLoading || !user) {
		return null;
	}

	return <CreateThreadDialog tags={tags} trigger={<CreateThreadFabButton />} />;
}
