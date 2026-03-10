/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: zenn-markdown-html sanitizes generated HTML. */
import markdownToHtml from "zenn-markdown-html";
import { cn } from "@/lib/utils";

type Props = {
	markdown: string;
	className?: string;
};

export async function MarkdownContent({ markdown, className }: Props) {
	const html = await markdownToHtml(markdown);

	return (
		<div
			className={cn("znc", className)}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
