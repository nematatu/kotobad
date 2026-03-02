"use client";

import { Loader2, Pencil } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	isSavingProfile: boolean;
	onConfirmAction: () => void;
};

export function UserProfileUpdateConfirmDialog({
	open,
	onOpenChangeAction,
	isSavingProfile,
	onConfirmAction,
}: Props) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChangeAction}>
			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
				<div className="mb-2 flex flex-col items-center justify-center gap-2 p-8">
					<div className="flex size-12 items-center justify-center rounded-full">
						<Pencil className="size-6" />
					</div>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center text-base font-semibold">
							プロフィールを更新しますか？
						</AlertDialogTitle>
						<AlertDialogDescription className="p-0 text-center text-sm text-slate-500">
							現在の編集内容でプロフィールを更新します。
						</AlertDialogDescription>
					</AlertDialogHeader>
				</div>
				<AlertDialogFooter className="grid flex-none grid-cols-2 gap-0 border-t pt-0">
					<AlertDialogCancel className="border-border h-12 flex-1 rounded-none border-0 border-r p-0">
						戻る
					</AlertDialogCancel>
					<AlertDialogAction
						className="h-12 flex-1 rounded-none border-0 p-0"
						disabled={isSavingProfile}
						onClick={onConfirmAction}
					>
						{isSavingProfile ? (
							<span className="inline-flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								更新中
							</span>
						) : (
							"更新する"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
