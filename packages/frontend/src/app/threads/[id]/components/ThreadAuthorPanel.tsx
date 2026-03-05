import type { ThreadType } from "@kotobad/shared/src/types/thread";
import Link from "next/link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type Props = {
	thread: ThreadType;
};

export const ThreadAuthorPanel = ({ thread }: Props) => {
	const bio = thread.author.bio?.trim() ?? "";

	return (
		<div className="rounded-lg bg-white p-3 sm:p-4">
			<p className="font-semibold tracking-wide text-slate-900">書いた人</p>
			<Link
				href={`/users/${encodeURIComponent(thread.authorId)}`}
				className="mt-2 inline-flex items-center gap-2 hover:text-blue-700 transition-colors"
			>
				<AuthorAvatar
					name={thread.author.name}
					image={thread.author.image}
					className="h-8 w-8 md:h-10 md:w-10"
				/>
				<span className="text-sm font-semibold text-slate-700">
					{thread.author.name}
				</span>
			</Link>
			<div className="mt-3">
				<p className="mt-1 text-xs text-slate-600">{bio}</p>
			</div>
		</div>
	);
};
