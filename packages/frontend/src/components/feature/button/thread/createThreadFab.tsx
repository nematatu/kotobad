import { PencilLine } from "lucide-react";
import type * as React from "react";
import IconButton from "@/components/common/button/IconButton";
import type { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateThreadFabButton(
	props: React.ComponentProps<typeof Button>,
) {
	const { className, ...rest } = props;

	return (
		<IconButton
			aria-label="投稿する"
			icon={<PencilLine />}
			variant="logo1"
			size="icon"
			hover="brightness"
			enableClickAnimation
			className={cn(
				"fixed bottom-5 right-5 z-[60] h-12 w-12 rounded-full shadow-lg md:hidden",
				className,
			)}
			{...rest}
		/>
	);
}
