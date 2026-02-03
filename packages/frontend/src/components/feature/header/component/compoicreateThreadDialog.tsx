import type { TagType } from "@kotobad/shared/src/types/tag";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateThreadForm } from "@/app/threads/components/create/CreateThread";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import CreateThreadButton from "../../button/thread/createThread";
import { UserPopover } from "../../user/popover/UserPopover";

type Props = {
	tags: TagType[];
};
export default function CreateThreadDialog({ tags }: Props) {
	const router = useRouter();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	return (
		<div className="flex items-center space-x-4">
			<UserPopover />
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogTrigger asChild>
					<CreateThreadButton />
				</DialogTrigger>
				<DialogContent className="" position={"tc"} size={"xl"}>
					<div className="p-4 pb-0">
						<DialogTitle>
							<header className="flex items-center gap-3">
								<div>
									<h2
										id="create-thread-title"
										className="text-base font-semibold text-slate-900"
									>
										新規スレッドを作成
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
