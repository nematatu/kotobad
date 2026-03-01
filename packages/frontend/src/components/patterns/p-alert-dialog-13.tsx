import { Pencil } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type props = {
	isConfirmOpen: boolean;
	setIsConfirmOpen: any;
	setIsEditing: any;
};

export function LogoutButton({
	isConfirmOpen,
	setIsConfirmOpen,
	setIsEditing,
}: props) {
	return (
		<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
			<AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
				<div className="flex flex-col items-center justify-center gap-2 p-8 mb-2">
					<div className="rounded-full size-12 flex items-center justify-center">
						<Pencil className="size-6" />
					</div>
					<AlertDialogTitle className="text-center text-base font-semibold">
						プロフィールを更新しますか？
					</AlertDialogTitle>
				</div>
				<AlertDialogFooter className="grid flex-none grid-cols-2 gap-0  border-t pt-0">
					<AlertDialogCancel className="border-border h-12 flex-1 rounded-none border-0 border-r p-0">
						戻る
					</AlertDialogCancel>
					<AlertDialogAction
						className="h-12 flex-1 rounded-none border-0 p-0"
						onClick={() => {
							setIsEditing(false);
							setIsConfirmOpen(false);
						}}
					>
						更新する
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
