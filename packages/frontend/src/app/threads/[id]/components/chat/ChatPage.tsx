import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChatPageProps = {
	header: ReactNode;
	messageList: ReactNode;
	messageInput: ReactNode;
	className?: string;
};

export const ChatPage = ({
	header,
	messageList,
	messageInput,
	className,
}: ChatPageProps) => {
	return (
		<Card
			className={cn(
				"overflow-hidden border-0 bg-[#f8fbff] shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-[#0b1220]",
				className,
			)}
		>
			<div className="flex flex-col">
				{header}
				<div>{messageList}</div>
				{messageInput}
			</div>
		</Card>
	);
};
