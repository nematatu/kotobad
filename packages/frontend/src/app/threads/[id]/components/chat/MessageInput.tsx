import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MessageInputProps = {
	children: ReactNode;
	className?: string;
};

export const MessageInput = ({ children, className }: MessageInputProps) => {
	return (
		<div
			className={cn("bg-[#f8fbff] p-3 dark:bg-[#0b1220] sm:p-3.5", className)}
		>
			{children}
		</div>
	);
};
