import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ThreadViewMode } from "../../lib/threadViewMode";
import { MessageInput } from "../chat/MessageInput";
import { MessageList } from "../chat/MessageList";

const PLACEHOLDER_MESSAGES = [
	{
		id: "message-skeleton-1",
		isMine: false,
		bodyWidthClassName: "w-40 sm:w-56",
		timeWidthClassName: "w-8",
	},
	{
		id: "message-skeleton-2",
		isMine: true,
		bodyWidthClassName: "w-28 sm:w-40",
		timeWidthClassName: "w-7",
	},
	{
		id: "message-skeleton-3",
		isMine: false,
		bodyWidthClassName: "w-48 sm:w-64",
		timeWidthClassName: "w-8",
	},
	{
		id: "message-skeleton-4",
		isMine: true,
		bodyWidthClassName: "w-36 sm:w-52",
		timeWidthClassName: "w-7",
	},
];

type ThreadPostsFallbackProps = {
	viewMode?: ThreadViewMode;
};

export const ThreadPostsFallback = ({
	viewMode = "chat",
}: ThreadPostsFallbackProps) => {
	if (viewMode === "thread") {
		return (
			<div className="space-y-3">
				<div className="hidden [@media(min-width:496px)]:block rounded-lg bg-white p-4">
					<Skeleton className="h-28 w-full rounded-lg bg-[#e5e7eb] dark:bg-[#334155]" />
				</div>
				{[0, 1, 2].map((index) => (
					<div
						key={`thread-fallback-${index}`}
						className={index === 2 ? "pl-4 sm:pl-6" : undefined}
					>
						<div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
							<div className="mb-2 flex items-center gap-2">
								<Skeleton className="h-5 w-5 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
								<Skeleton className="h-3 w-20 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
								<Skeleton className="h-3 w-10 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
							</div>
							<Skeleton className="mb-2 h-4 w-[70%] rounded bg-[#e2e8f0] dark:bg-[#334155]" />
							<Skeleton className="h-4 w-[88%] rounded bg-[#e2e8f0] dark:bg-[#334155]" />
							<div className="mt-3 flex gap-2">
								<Skeleton className="h-7 w-20 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
								<Skeleton className="h-7 w-16 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<Card className="overflow-hidden border-0 bg-[#f8fbff] shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-[#0b1220]">
			<div className="flex flex-col">
				<div>
					<MessageList autoScrollKey={0} autoScrollEnabled={false}>
						{PLACEHOLDER_MESSAGES.map((message) => (
							<div key={message.id} className="mb-4">
								{message.isMine ? null : (
									<div className="mb-1 flex items-center gap-1.5 px-1">
										<Skeleton className="h-5 w-5 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
										<Skeleton className="h-3 w-20 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
									</div>
								)}
								<div
									className={`flex w-full ${
										message.isMine ? "justify-end" : "justify-start"
									}`}
								>
									<div className="relative">
										<Skeleton
											className={`rounded-[18px] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)] ${
												message.isMine
													? "rounded-br-[6px] bg-[#dbeafe] dark:bg-[#31507a]"
													: "rounded-bl-[6px] bg-[#eef2f7] dark:bg-[#1f2937]"
											}`}
										>
											<div
												className={`h-4 rounded ${message.bodyWidthClassName} ${
													message.isMine
														? "bg-[#bfdbfe] dark:bg-[#45648d]"
														: "bg-[#cbd5e1] dark:bg-[#475569]"
												}`}
											/>
										</Skeleton>
										<Skeleton
											className={`absolute bottom-1 h-2 rounded ${
												message.timeWidthClassName
											} ${
												message.isMine
													? "right-[calc(100%+0.35rem)] bg-[#bfdbfe] dark:bg-[#475569]"
													: "left-[calc(100%+0.35rem)] bg-[#cbd5e1] dark:bg-[#475569]"
											}`}
										/>
									</div>
								</div>
								<div
									className={`mt-1 flex items-center gap-2 ${
										message.isMine ? "justify-end pr-1" : "pl-1"
									}`}
								>
									<Skeleton className="h-6 w-6 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
									<Skeleton className="h-6 w-6 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
								</div>
							</div>
						))}
					</MessageList>
				</div>
				<MessageInput>
					<div className="flex items-end gap-2">
						<Skeleton className="min-h-[48px] flex-1 rounded-xl bg-[#e5e7eb] dark:bg-[#334155]" />
						<Skeleton className="h-9 w-14 rounded-md bg-[#bfdbfe] dark:bg-[#1e40af]" />
					</div>
				</MessageInput>
			</div>
		</Card>
	);
};
