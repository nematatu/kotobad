import NextLink from "next/link";
import type * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
	markdown: string;
	className?: string;
};

type MarkdownBlock =
	| {
			type: "heading";
			level: number;
			text: string;
	  }
	| {
			type: "paragraph";
			text: string;
	  }
	| {
			type: "list";
			ordered: boolean;
			items: string[];
	  }
	| {
			type: "code";
			language?: string;
			code: string;
	  }
	| {
			type: "blockquote";
			paragraphs: string[];
	  }
	| {
			type: "horizontal-rule";
	  };

const HEADING_PATTERN = /^(#{1,6})\s+(.+)$/;
const ORDERED_LIST_PATTERN = /^\s*\d+\.\s+(.+)$/;
const UNORDERED_LIST_PATTERN = /^\s*[-*]\s+(.+)$/;
const BLOCKQUOTE_PATTERN = /^>\s?(.*)$/;
const CODE_FENCE_PATTERN = /^```([\w-]+)?\s*$/;
const HORIZONTAL_RULE_PATTERN = /^(\*{3,}|-{3,}|_{3,})\s*$/;
const INLINE_MARKDOWN_PATTERN =
	/(\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

const isBlockBoundary = (line: string) =>
	HEADING_PATTERN.test(line) ||
	ORDERED_LIST_PATTERN.test(line) ||
	UNORDERED_LIST_PATTERN.test(line) ||
	BLOCKQUOTE_PATTERN.test(line) ||
	CODE_FENCE_PATTERN.test(line) ||
	HORIZONTAL_RULE_PATTERN.test(line);

const getHeadingClassName = (level: number) => {
	if (level <= 2) {
		return "text-[22px] font-bold tracking-tight text-slate-950 dark:text-slate-50";
	}

	if (level === 3) {
		return "text-[18px] font-bold tracking-tight text-slate-950 dark:text-slate-50";
	}

	return "text-[16px] font-semibold tracking-tight text-slate-900 dark:text-slate-100";
};

const renderLink = (href: string, text: string, key: string) => {
	const className =
		"font-medium text-sky-600 underline underline-offset-4 hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200";

	if (href.startsWith("/")) {
		return (
			<NextLink key={key} href={href} className={className}>
				{text}
			</NextLink>
		);
	}

	return (
		<a
			key={key}
			href={href}
			target="_blank"
			rel="noreferrer noopener"
			className={className}
		>
			{text}
		</a>
	);
};

const renderInlineMarkdown = (text: string, keyPrefix: string) => {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	let partIndex = 0;

	for (const match of text.matchAll(INLINE_MARKDOWN_PATTERN)) {
		const index = match.index;
		if (typeof index !== "number") {
			continue;
		}

		if (index > lastIndex) {
			nodes.push(text.slice(lastIndex, index));
		}

		if (match[2] && match[3]) {
			nodes.push(
				renderLink(match[3], match[2], `${keyPrefix}-link-${partIndex}`),
			);
		} else if (match[4]) {
			nodes.push(
				<code
					key={`${keyPrefix}-code-${partIndex}`}
					className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-800 dark:bg-slate-800 dark:text-slate-100"
				>
					{match[4]}
				</code>,
			);
		} else if (match[5]) {
			nodes.push(
				<strong key={`${keyPrefix}-strong-${partIndex}`}>{match[5]}</strong>,
			);
		} else if (match[6]) {
			nodes.push(<em key={`${keyPrefix}-em-${partIndex}`}>{match[6]}</em>);
		}

		lastIndex = index + match[0].length;
		partIndex += 1;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	return nodes.length > 0 ? nodes : [text];
};

const parseMarkdown = (markdown: string): MarkdownBlock[] => {
	const lines = markdown.replace(/\r\n?/g, "\n").trim().split("\n");
	const blocks: MarkdownBlock[] = [];

	let index = 0;
	while (index < lines.length) {
		const line = lines[index];

		if (!line || line.trim().length === 0) {
			index += 1;
			continue;
		}

		const codeFenceMatch = line.match(CODE_FENCE_PATTERN);
		if (codeFenceMatch) {
			const codeLines: string[] = [];
			index += 1;

			while (index < lines.length && !CODE_FENCE_PATTERN.test(lines[index])) {
				codeLines.push(lines[index]);
				index += 1;
			}

			if (index < lines.length) {
				index += 1;
			}

			blocks.push({
				type: "code",
				language: codeFenceMatch[1],
				code: codeLines.join("\n"),
			});
			continue;
		}

		if (HORIZONTAL_RULE_PATTERN.test(line)) {
			blocks.push({ type: "horizontal-rule" });
			index += 1;
			continue;
		}

		const headingMatch = line.match(HEADING_PATTERN);
		if (headingMatch) {
			blocks.push({
				type: "heading",
				level: headingMatch[1].length,
				text: headingMatch[2].trim(),
			});
			index += 1;
			continue;
		}

		const unorderedListMatch = line.match(UNORDERED_LIST_PATTERN);
		if (unorderedListMatch) {
			const items: string[] = [];

			while (index < lines.length) {
				const currentMatch = lines[index].match(UNORDERED_LIST_PATTERN);
				if (!currentMatch) {
					break;
				}

				items.push(currentMatch[1].trim());
				index += 1;
			}

			blocks.push({ type: "list", ordered: false, items });
			continue;
		}

		const orderedListMatch = line.match(ORDERED_LIST_PATTERN);
		if (orderedListMatch) {
			const items: string[] = [];

			while (index < lines.length) {
				const currentMatch = lines[index].match(ORDERED_LIST_PATTERN);
				if (!currentMatch) {
					break;
				}

				items.push(currentMatch[1].trim());
				index += 1;
			}

			blocks.push({ type: "list", ordered: true, items });
			continue;
		}

		const blockquoteMatch = line.match(BLOCKQUOTE_PATTERN);
		if (blockquoteMatch) {
			const quoteLines: string[] = [];

			while (index < lines.length) {
				const currentLine = lines[index];
				if (!currentLine.trim()) {
					quoteLines.push("");
					index += 1;
					continue;
				}

				const currentMatch = currentLine.match(BLOCKQUOTE_PATTERN);
				if (!currentMatch) {
					break;
				}

				quoteLines.push(currentMatch[1]);
				index += 1;
			}

			const paragraphs = quoteLines
				.join("\n")
				.split(/\n{2,}/)
				.map((paragraph) => paragraph.replace(/\n/g, " ").trim())
				.filter(Boolean);

			blocks.push({ type: "blockquote", paragraphs });
			continue;
		}

		const paragraphLines: string[] = [];
		while (index < lines.length) {
			const currentLine = lines[index];
			if (!currentLine.trim()) {
				break;
			}

			if (isBlockBoundary(currentLine)) {
				break;
			}

			paragraphLines.push(currentLine.trim());
			index += 1;
		}

		if (paragraphLines.length > 0) {
			blocks.push({
				type: "paragraph",
				text: paragraphLines.join(" "),
			});
			continue;
		}

		index += 1;
	}

	return blocks;
};

export function MarkdownContent({ markdown, className }: Props) {
	const blocks = parseMarkdown(markdown);

	return (
		<div className={cn("space-y-5", className)}>
			{blocks.map((block, index) => {
				const key = `${block.type}-${index}`;

				if (block.type === "heading") {
					const HeadingTag =
						`h${Math.min(block.level, 6)}` as keyof React.JSX.IntrinsicElements;

					return (
						<HeadingTag key={key} className={getHeadingClassName(block.level)}>
							{renderInlineMarkdown(block.text, key)}
						</HeadingTag>
					);
				}

				if (block.type === "paragraph") {
					return (
						<p
							key={key}
							className="text-[15px] leading-8 text-slate-600 dark:text-slate-300"
						>
							{renderInlineMarkdown(block.text, key)}
						</p>
					);
				}

				if (block.type === "list") {
					const ListTag = block.ordered ? "ol" : "ul";

					return (
						<ListTag
							key={key}
							className={cn(
								"space-y-2 pl-6 text-[15px] leading-8 text-slate-600 dark:text-slate-300",
								block.ordered ? "list-decimal" : "list-disc",
							)}
						>
							{block.items.map((item) => (
								<li key={`${key}-item-${item}`}>
									{renderInlineMarkdown(item, `${key}-item-${item}`)}
								</li>
							))}
						</ListTag>
					);
				}

				if (block.type === "code") {
					return (
						<div
							key={key}
							className="overflow-x-auto rounded-[22px] bg-slate-950 px-4 py-4 text-slate-100"
						>
							{block.language ? (
								<p className="mb-3 text-[12px] font-semibold tracking-[0.08em] text-slate-400 uppercase">
									{block.language}
								</p>
							) : null}
							<pre className="font-mono text-[13px] leading-6 whitespace-pre-wrap">
								<code>{block.code}</code>
							</pre>
						</div>
					);
				}

				if (block.type === "blockquote") {
					return (
						<blockquote
							key={key}
							className="space-y-3 rounded-r-[20px] border-l-4 border-sky-200 bg-sky-50/70 px-4 py-3 dark:border-sky-400/30 dark:bg-sky-500/10"
						>
							{block.paragraphs.map((paragraph) => (
								<p
									key={`${key}-paragraph-${paragraph}`}
									className="text-[15px] leading-8 text-slate-600 dark:text-slate-300"
								>
									{renderInlineMarkdown(
										paragraph,
										`${key}-paragraph-${paragraph}`,
									)}
								</p>
							))}
						</blockquote>
					);
				}

				return (
					<hr key={key} className="border-slate-200 dark:border-slate-800" />
				);
			})}
		</div>
	);
}
