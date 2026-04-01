"use client";

import type { FavoritePlayerType } from "@kotobad/shared/src/types/user";
import { Loader2 } from "lucide-react";
import type { MouseEvent } from "react";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
	open: boolean;
	onOpenChangeAction: (open: boolean) => void;
	isSavingProfile: boolean;
	profileId: string;
	previewName: string;
	previewBio: string;
	previewAvatarImage: string | null;
	previewFavoritePlayers: FavoritePlayerType[];
	onConfirmAction: () => Promise<void> | void;
};

export function UserProfileUpdateConfirmDialog({
	open,
	onOpenChangeAction,
	isSavingProfile,
	profileId,
	previewName,
	previewBio,
	previewAvatarImage,
	previewFavoritePlayers,
	onConfirmAction,
}: Props) {
	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && isSavingProfile) return;
		onOpenChangeAction(nextOpen);
	};

	const handleConfirmClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		void onConfirmAction();
	};
	const normalizedPreviewName = previewName.trim();
	const normalizedPreviewBio = previewBio.trim();

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
				<div className="mb-2 flex flex-col items-center justify-center gap-2 p-8">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-center text-base font-semibold">
							プロフィールを更新しますか？
						</AlertDialogTitle>
					</AlertDialogHeader>
					<div className="w-full text-left">
						<section className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
							<div className="h-16 bg-[linear-gradient(135deg,#93c5fd_0%,#dbeafe_42%,#cffafe_100%)]" />
							<div className="-mt-8 px-3 pb-3">
								<div className="group relative inline-flex">
									<AuthorAvatar
										name={normalizedPreviewName}
										image={previewAvatarImage}
										className="h-16 w-16 border-4 border-white bg-white"
										fallbackClassName="text-xs"
									/>
								</div>
								<div className="mt-2 space-y-2">
									<div className="flex min-w-0 flex-col gap-y-1">
										<p className="truncate text-base font-bold text-slate-900">
											{normalizedPreviewName || "（名前未入力）"}
										</p>
										<p className="text-xs text-slate-400">@{profileId}</p>
									</div>
									{normalizedPreviewBio ? (
										<p className="max-h-24 overflow-y-auto whitespace-pre-line break-words text-sm text-slate-600">
											{previewBio}
										</p>
									) : (
										<p className="text-sm text-slate-400">
											自己紹介は未入力です
										</p>
									)}
									<div className="space-y-1">
										<p className="text-xs font-medium text-slate-500">
											好きな選手
										</p>
										{previewFavoritePlayers.length === 0 ? (
											<p className="text-sm text-slate-400">未選択です</p>
										) : (
											<div className="flex flex-wrap gap-x-2 gap-y-1.5">
												{previewFavoritePlayers.map((player) => (
													<div
														key={player.id}
														className="flex w-[5.25rem] flex-col items-start gap-0.5 text-left"
													>
														<AuthorAvatar
															name={player.name}
															image={player.imageUrl}
															className="h-16 w-16 rounded-md bg-white"
															fallbackClassName="rounded-md text-xs"
															imageClassName="scale-110"
														/>
														<span className="text-xs leading-tight text-slate-700">
															{player.name}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
				<AlertDialogFooter className="grid flex-none grid-cols-2 gap-0 border-t pt-0 sm:space-x-0">
					<AlertDialogCancel
						className="border-border mt-0 h-12 flex-1 rounded-none border-0 border-r p-0"
						disabled={isSavingProfile}
					>
						戻る
					</AlertDialogCancel>
					<AlertDialogAction
						className="h-12 flex-1 rounded-none border-0 bg-blue-600 p-0 text-white transition-colors [@media(hover:hover)]:hover:bg-blue-700 disabled:bg-blue-400"
						disabled={isSavingProfile}
						onClick={handleConfirmClick}
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
