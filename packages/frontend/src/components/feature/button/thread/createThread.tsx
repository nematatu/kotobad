import { PencilLine } from "lucide-react";
import type * as React from "react";
import IconButton from "@/components/common/button/IconButton";
import type { Button } from "@/components/ui/button";

export default function CreateThreadButton(
	props: React.ComponentProps<typeof Button>,
) {
	return (
		<IconButton
			hover="brightness"
			icon={<PencilLine />}
			variant="logo1"
			{...props}
			click
		>
			<span className="text-md">スレッド作成</span>
		</IconButton>
	);
}
