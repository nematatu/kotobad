import { Skeleton } from "@/components/ui/skeleton";
import { ChatPage } from "../chat/ChatPage";

const PLACEHOLDER_MESSAGES = [
	{ id: "message-skeleton-1", isMine: false, widthClassName: "w-56" },
	{ id: "message-skeleton-2", isMine: true, widthClassName: "w-40" },
	{ id: "message-skeleton-3", isMine: false, widthClassName: "w-64" },
	{ id: "message-skeleton-4", isMine: true, widthClassName: "w-52" },
];

export const ThreadPostsFallback = () => {
	return (
		<ChatPage
			header={
				<div className="border-b border-[#d7dee6] bg-[#ffffff] px-4 py-2.5 dark:border-[#334155] dark:bg-[#0f172a] sm:px-5">
					<div className="flex items-center justify-between gap-3">
						<div className="space-y-2">
							<Skeleton className="h-4 w-40 bg-[#e5e7eb] dark:bg-[#334155] sm:w-56" />
						</div>
						<Skeleton className="h-6 w-10 rounded-full bg-[#e5e7eb] dark:bg-[#334155]" />
					</div>
				</div>
			}
			messageList={
				<div className="bg-[#b7d8a8] px-3 py-4 dark:bg-[#1f2a1f] sm:px-4">
					{PLACEHOLDER_MESSAGES.map((message) => (
						<div
							key={message.id}
							className={`mb-3 flex w-full ${
								message.isMine ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[88%] rounded-[18px] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)] sm:max-w-[76%] ${
									message.isMine
										? "rounded-br-[6px] bg-[#06C755]/80"
										: "rounded-bl-[6px] bg-white dark:bg-[#334155]"
								}`}
							>
								<div className="space-y-2">
									{message.isMine ? null : (
										<Skeleton className="h-3 w-16 bg-[#d1d5db] dark:bg-[#64748b]" />
									)}
									<Skeleton
										className={`h-4 ${message.widthClassName} ${
											message.isMine
												? "bg-[#b7f0ca]"
												: "bg-[#d1d5db] dark:bg-[#64748b]"
										}`}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			}
			messageInput={
				<div className="border-t border-[#d7dee6] bg-[#ffffff] p-3 dark:border-[#334155] dark:bg-[#0f172a] sm:p-3.5">
					<div className="flex items-end gap-2">
						<Skeleton className="min-h-[48px] flex-1 rounded-xl bg-[#e5e7eb] dark:bg-[#334155]" />
						<Skeleton className="h-9 w-14 rounded-md bg-[#bfdbfe] dark:bg-[#1e40af]" />
					</div>
				</div>
			}
		/>
	);
};
