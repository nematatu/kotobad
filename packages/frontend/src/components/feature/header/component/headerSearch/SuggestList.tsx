"use client";

import type { ThreadType } from "@kotobad/shared/src/types/thread";
import { getRelativeDate } from "@kotobad/shared/src/utils/date/getRelativeDate";
import ChatIcon from "@/assets/threads/chat.svg";
import { Link } from "@/components/common/Link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import { highlightText } from "./highlightText";

type Props = {
	items: ThreadType[];
	query: string;
};

const SuggestList = ({ items, query }: Props) => {
	return (
		<div className="flex max-h-[50vh] flex-col overflow-y-auto">
			{items.map((thread) => (
				<Link
					key={thread.id}
					href={`/threads/${thread.id}`}
					className="flex gap-3 px-3 py-3 text-sm text-slate-900 hover:bg-slate-100 border-t border-slate-200 first:border-t-0"
				>
					<AuthorAvatar
						name={thread.author.name}
						image={thread.author.image}
						className="w-7 h-7 border border-slate-200 bg-white"
						fallbackClassName="text-xs"
					/>
					<div className="min-w-0">
						<div className="text-sm font-semibold">
							{highlightText(thread.title, query)}
						</div>
						<div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
							<span>{thread.author.name}</span>
							<span className="text-slate-300">・</span>
							<span>{getRelativeDate(thread.createdAt)}</span>
							<span className="text-slate-300">・</span>
							<span className="inline-flex items-center gap-1">
								<ChatIcon className="h-3 w-3 text-slate-400" />
								{thread.postCount}件
							</span>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default SuggestList;
