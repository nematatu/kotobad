import { Reply } from "lucide-react";
import IconButton from "@/components/common/button/IconButton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type PostReplyProps = {
	handleClick: () => void;
};

export function PostReplyButton({ handleClick }: PostReplyProps) {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<IconButton
						type="button"
						enableClickAnimation
						variant="ghost"
						size="icon"
						icon={<Reply />}
						onClick={handleClick}
						aria-label="この投稿に返信"
					/>
				</TooltipTrigger>
				<TooltipContent>返信する</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
