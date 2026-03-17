"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CreatePostForm } from "./CreatePostForm";
import type { ReplyTarget } from "./types/replyTarget";

type PostReplyInlineFormProps = {
	postId: number;
	threadId: number;
	replyTarget: ReplyTarget | null;
	isOpen: boolean;
	keySuffix: "thread" | "chat";
	className?: string;
	onCloseAction: () => void;
};

export const PostReplyInlineForm = ({
	postId,
	threadId,
	replyTarget,
	isOpen,
	keySuffix,
	className,
	onCloseAction,
}: PostReplyInlineFormProps) => {
	return (
		<AnimatePresence initial={false}>
			{isOpen ? (
				<motion.div
					key={`${postId}:reply-form:${keySuffix}`}
					layout
					initial={{ opacity: 0, height: 0, y: -4 }}
					animate={{ opacity: 1, height: "auto", y: 0 }}
					exit={{ opacity: 0, height: 0, y: -4 }}
					transition={{
						duration: 0.22,
						ease: [0.22, 1, 0.36, 1],
					}}
					className={className}
				>
					<CreatePostForm
						threadId={threadId}
						replyTarget={replyTarget}
						variant="inline"
						onPostedAction={onCloseAction}
						onClearReplyTargetAction={onCloseAction}
					/>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};
