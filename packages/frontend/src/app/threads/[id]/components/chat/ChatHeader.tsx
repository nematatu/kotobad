type ChatHeaderProps = {
	title: string;
	messageCount: number;
};

export const ChatHeader = ({ title, messageCount }: ChatHeaderProps) => {
	return (
		<div className="border-b border-[#d7dee6] bg-[#ffffff] px-4 py-2.5 dark:border-[#334155] dark:bg-[#0f172a] sm:px-5">
			<div className="flex items-center justify-between gap-3">
				<p className="line-clamp-1 text-[#111827] text-sm font-semibold dark:text-[#e5e7eb] sm:text-base">
					{title}
				</p>
				<span className="shrink-0 rounded-full bg-[#eef2f7] px-2.5 py-0.5 text-[#5b6472] text-xs font-medium dark:bg-[#1f2937] dark:text-[#cbd5e1]">
					{messageCount}
				</span>
			</div>
		</div>
	);
};
