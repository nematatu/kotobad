import type { TagType } from "@kotobad/shared/src/types/tag";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useState } from "react";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { headingJosefinSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils";
import CreateThreadButton from "../../button/thread/createThread";

type Props = {
	tags: TagType[];
	trigger?: React.ReactElement;
	className?: string;
	showUserPopover?: boolean;
};

export default function CreateThreadDialog({
	tags,
	trigger,
	className,
}: Props) {
	const router = useRouter();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	return (
		<div className={cn("flex items-center", className)}>
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogTrigger asChild>
					{trigger ?? <CreateThreadButton />}
				</DialogTrigger>
				<DialogContent position={"tc"} size={"xl"}>
					<div className="p-4 pb-0">
						<DialogTitle>
							<header className="flex items-center gap-3">
								<div>
									<h2
										id="create-thread-title"
										className={`${headingJosefinSans.className} text-[28px] leading-none font-bold tracking-[0.06em] text-slate-900 dark:text-slate-100`}
									>
										Create Thread
									</h2>
									<p className="text-xs text-slate-500">
										今の気持ちや話題をシェアしましょう
									</p>
								</div>
							</header>
						</DialogTitle>
					</div>
					<CreateThreadForm
						onCreated={() => {
							router.refresh();
							setIsCreateOpen(false);
						}}
						initialTags={tags}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
