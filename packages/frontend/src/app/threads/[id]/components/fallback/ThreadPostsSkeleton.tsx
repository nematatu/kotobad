import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ThreadViewMode } from "../../lib/threadViewMode";
import { MessageInput } from "../chat/MessageInput";
import { MessageList } from "../chat/MessageList";

const PLACEHOLDER_MESSAGES = [
	{
		id: "message-skeleton-1",
		isMine: true,
		depth: 0,
		bodyWidthClassName: "w-40 sm:w-56",
		timeWidthClassName: "w-8",
	},
	{
		id: "message-skeleton-2",
		isMine: false,
		depth: 0,
		bodyWidthClassName: "w-28 sm:w-40",
		timeWidthClassName: "w-7",
	},
	{
		id: "message-skeleton-3",
		isMine: false,
		depth: 1,
		bodyWidthClassName: "w-48 sm:w-64",
		timeWidthClassName: "w-8",
	},
	{
		id: "message-skeleton-4",
		isMine: true,
		depth: 0,
		bodyWidthClassName: "w-36 sm:w-52",
		timeWidthClassName: "w-7",
	},
];

const PLACEHOLDER_THREAD_ITEMS = [
	{
		id: "thread-skeleton-1",
		depth: 0,
		bodyWidthClassName: "w-[70%]",
		subBodyWidthClassName: "w-[88%]",
	},
	{
		id: "thread-skeleton-2",
		depth: 0,
		bodyWidthClassName: "w-[62%]",
		subBodyWidthClassName: "w-[82%]",
	},
	{
		id: "thread-skeleton-3",
		depth: 1,
		bodyWidthClassName: "w-[66%]",
		subBodyWidthClassName: "w-[86%]",
	},
];

type ThreadPostsFallbackProps = {
	viewMode?: ThreadViewMode;
};

const renderCreatePostFormSkeleton = () => {
	return (
		<div className="w-full min-w-0 rounded-full border border-slate-200 bg-gray-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900">
			<div className="flex items-center gap-2">
				<div className="mt-0.5 shrink-0">
					<Skeleton className="h-7 w-7 rounded-full bg-[#dbe4ee] dark:bg-[#334155] sm:h-10 sm:w-10" />
				</div>
				<div className="shrink-0">
					<div className="flex h-9 w-9 items-center justify-center rounded-md">
						<Skeleton className="h-4 w-4 rounded-sm bg-[#dbe4ee] dark:bg-[#334155]" />
					</div>
				</div>
				<Skeleton className="h-[34px] flex-1 rounded-md bg-[#e5e7eb] dark:bg-[#334155]" />
				<Skeleton className="h-9 w-9 rounded-full bg-[#bfdbfe] dark:bg-[#1e40af]" />
			</div>
		</div>
	);
};

export const ThreadPostsFallback = ({
	viewMode = "chat",
}: ThreadPostsFallbackProps) => {
	if (viewMode === "thread") {
		return (
			<div className="space-y-3">
				<div className="px-4 pb-2 pt-4">{renderCreatePostFormSkeleton()}</div>
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
					{PLACEHOLDER_THREAD_ITEMS.map((item, index) => (
						<div
							key={item.id}
							className={cn(
								"relative px-3 py-3 sm:px-4",
								index > 0
									? "border-slate-300 border-t dark:border-slate-800"
									: undefined,
							)}
							style={
								item.depth > 0
									? {
											marginInlineStart: `${Math.min(item.depth, 8) * 22}px`,
										}
									: undefined
							}
						>
							<div className="flex items-start">
								<div className="min-w-0 flex-1">
									<div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
										<div className="inline-flex max-w-[220px] items-center gap-1.5">
											<Skeleton
												className={cn(
													item.depth > 0 ? "h-5 w-5" : "h-7 w-7",
													"rounded-full bg-[#dbe4ee] dark:bg-[#334155]",
												)}
											/>
											<Skeleton className="h-3 w-24 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
										</div>
										<Skeleton className="h-3 w-8 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
										<Skeleton className="h-3 w-2 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
										<Skeleton className="h-3 w-10 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
									</div>
									<div className="pl-9">
										<div className="space-y-2">
											<Skeleton
												className={cn(
													"h-4 rounded bg-[#e2e8f0] dark:bg-[#334155]",
													item.bodyWidthClassName,
												)}
											/>
											<Skeleton
												className={cn(
													"h-4 rounded bg-[#e2e8f0] dark:bg-[#334155]",
													item.subBodyWidthClassName,
												)}
											/>
										</div>
										<div className="mt-2 flex flex-wrap items-center gap-1.5">
											<Skeleton className="h-5 w-12 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
											<Skeleton className="h-5 w-10 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
										</div>
										<div className="mt-1 flex flex-wrap items-center gap-2">
											<Skeleton className="h-6 w-8 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
											<Skeleton className="h-6 w-8 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<Card className="overflow-hidden border-0 bg-[#f8fbff] shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-[#0b1220]">
			<div className="flex flex-col">
				<div>
					<MessageList autoScrollKey={0} autoScrollEnabled={false}>
						{PLACEHOLDER_MESSAGES.map((message) => (
							<div
								key={message.id}
								className={cn(
									"mb-3",
									message.depth > 0 && !message.isMine
										? "pl-2 sm:pl-4"
										: undefined,
								)}
							>
								{message.isMine ? null : (
									<div className="mb-3 inline-flex max-w-[196px] items-center gap-3 px-1">
										<Skeleton className="h-5 w-5 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
										<Skeleton className="h-3 w-24 rounded bg-[#dbe4ee] dark:bg-[#334155]" />
									</div>
								)}
								<div className={message.isMine ? undefined : "pl-6"}>
									<div
										className={cn(
											"mb-1 flex w-full",
											message.isMine ? "justify-end" : "justify-start pl-2",
										)}
									>
										<div
											className={cn(
												"inline-flex items-end gap-1.5",
												message.isMine
													? "flex-row-reverse -ml-3 pl-3"
													: "flex-row -mr-3 pr-3",
												message.depth > 0 && !message.isMine
													? "ml-1.5 sm:ml-3"
													: undefined,
											)}
										>
											<Skeleton
												className={cn(
													"rounded-[18px] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]",
													message.isMine
														? "rounded-tr-[6px] bg-[#dbeafe] dark:bg-[#31507a]"
														: "rounded-tl-[6px] bg-[#eef2f7] dark:bg-[#1f2937]",
												)}
											>
												<div
													className={cn(
														"h-4 rounded",
														message.bodyWidthClassName,
														message.isMine
															? "bg-[#bfdbfe] dark:bg-[#45648d]"
															: "bg-[#cbd5e1] dark:bg-[#475569]",
													)}
												/>
											</Skeleton>
											<div
												className={cn(
													"relative h-8 w-[5.25rem] shrink-0",
													message.isMine ? "pr-3" : "pl-3",
												)}
											>
												<Skeleton
													className={cn(
														"absolute top-1/2 h-2 -translate-y-1/2 rounded",
														message.timeWidthClassName,
														message.isMine
															? "right-3 bg-[#bfdbfe] dark:bg-[#475569]"
															: "left-3 bg-[#cbd5e1] dark:bg-[#475569]",
													)}
												/>
											</div>
										</div>
									</div>
									<div
										className={cn(
											"mt-0.5 flex flex-wrap items-center gap-2",
											message.isMine ? "justify-end pr-1" : "pl-1",
										)}
									>
										<Skeleton className="h-6 w-10 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
										<Skeleton className="h-6 w-12 rounded-full bg-[#dbe4ee] dark:bg-[#334155]" />
									</div>
								</div>
							</div>
						))}
					</MessageList>
				</div>
				<MessageInput className="hidden [@media(min-width:496px)]:block">
					{renderCreatePostFormSkeleton()}
				</MessageInput>
			</div>
		</Card>
	);
};
