"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdLink } from "react-icons/md";
import { PiXLogo } from "react-icons/pi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	buildLineShareIntentUrl,
	buildShareUrlFromPath,
	buildXShareIntentUrl,
	copyTextToClipboard,
} from "@/lib/thread/shareClient";
import { cn } from "@/lib/utils";

type ThreadShareButtonProps = {
	threadTitle: string;
	className?: string;
};

export const ThreadShareButton = ({
	threadTitle,
	className,
}: ThreadShareButtonProps) => {
	const pathname = usePathname();
	const shareUrl = buildShareUrlFromPath(pathname);
	const xShareUrl = buildXShareIntentUrl({
		url: shareUrl,
		text: threadTitle,
	});
	const lineShareUrl = buildLineShareIntentUrl({
		url: shareUrl,
	});

	const copyLinkHandler = async () => {
		const isCopied = await copyTextToClipboard(shareUrl);
		if (isCopied) {
			toast.success("リンクをコピーしました");
			return true;
		}
		toast.error("コピーに失敗しました");
		return false;
	};

	return (
		<div className={cn("flex flex-wrap items-center gap-1.5", className)}>
			<Button
				type="button"
				variant="ghost"
				rounded="full"
				enableClickAnimation
				aria-label="リンクをコピー"
				onClick={copyLinkHandler}
				className="size-8 rounded-full border border-slate-200 bg-white/90 p-0 [@media(hover:hover)]:hover:brightness-95 dark:border-slate-700 dark:bg-slate-900/80 dark:[@media(hover:hover)]:hover:brightness-110 sm:size-9"
			>
				<MdLink className="size-[20px] rotate-135 text-[#2563eb]" />
			</Button>
			<Button
				asChild
				variant="ghost"
				rounded="full"
				enableClickAnimation
				className="size-8  border bg-black p-0 [@media(hover:hover)]:hover:bg-black/80 dark:border-black dark:bg-black sm:size-9"
			>
				<a
					href={xShareUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Xで共有"
				>
					<PiXLogo className="size-[21px] text-white" />
				</a>
			</Button>
			<Button
				asChild
				variant="ghost"
				rounded="full"
				enableClickAnimation
				className="size-8  p-0 [@media(hover:hover)]:hover:bg-[#0e9f45] sm:size-9"
			>
				<a
					href={lineShareUrl}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="LINEで共有"
				>
					<Image
						src="/assets/logo/LINE_Brand_icon.png"
						alt="LINE"
						aria-hidden="true"
						width={32}
						height={32}
						className="w-[32px] object-contain"
					/>
				</a>
			</Button>
		</div>
	);
};
