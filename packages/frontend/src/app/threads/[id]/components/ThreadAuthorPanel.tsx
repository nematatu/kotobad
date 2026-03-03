import type { ThreadType } from "@kotobad/shared/src/types/thread";
import Link from "next/link";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";

type Props = {
	thread: ThreadType;
};

export const ThreadAuthorPanel = ({ thread }: Props) => {
	return (
		<div className="rounded-xl border border-slate-200 p-3 sm:p-4">
			<p className="text-[11px] font-semibold tracking-wide text-slate-500">
				書いた人
			</p>
			<Link
				href={`/users/${encodeURIComponent(thread.authorId)}`}
				className="mt-2 inline-flex items-center gap-2 hover:text-blue-700 transition-colors"
			>
				<AuthorAvatar
					name={thread.author.name}
					image={thread.author.image}
					className="h-7 w-7 md:h-8 md:w-8"
				/>
				<span className="text-sm font-semibold text-slate-700">
					{thread.author.name}
				</span>
			</Link>
			<div className="mt-3">
				<p className="text-[11px] font-semibold text-slate-500">Bio</p>
				<p className="mt-1 text-xs text-slate-600">プロフィールは未設定です</p>
			</div>
		</div>
	);
};
