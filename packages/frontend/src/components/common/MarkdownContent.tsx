/* biome-ignore-all lint/performance/noImgElement: markdown images and GIFs use arbitrary URLs and sizes. */
import NextLink from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type Props = {
	markdown: string;
	className?: string;
};

export function MarkdownContent({ markdown, className }: Props) {
	return (
		<div className={cn("markdown-content", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ children }) => (
						<h1 className="mt-14 text-[26px] font-bold tracking-tight text-slate-950 first:mt-0 dark:text-slate-50">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="mt-12 text-[22px] font-bold tracking-tight text-slate-950 first:mt-0 dark:text-slate-50">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="mt-10 text-[18px] font-bold tracking-tight text-slate-950 first:mt-0 dark:text-slate-50">
							{children}
						</h3>
					),
					h4: ({ children }) => (
						<h4 className="mt-8 text-[16px] font-bold tracking-tight text-slate-950 first:mt-0 dark:text-slate-50">
							{children}
						</h4>
					),
					h5: ({ children }) => (
						<h5 className="mt-8 text-[15px] font-bold tracking-tight text-slate-950 first:mt-0 dark:text-slate-50">
							{children}
						</h5>
					),
					h6: ({ children }) => (
						<h6 className="mt-8 text-[14px] font-bold tracking-tight text-slate-950 first:mt-0 dark:text-slate-50">
							{children}
						</h6>
					),
					p: ({ children }) => (
						<p className="mt-6 text-[15px] leading-8 first:mt-0 text-slate-600 sm:leading-9 dark:text-slate-300">
							{children}
						</p>
					),
					ul: ({ children }) => (
						<ul className="mt-6 list-disc space-y-3 pl-6 text-[15px] leading-8 first:mt-0 text-slate-600 sm:leading-9 dark:text-slate-300">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="mt-6 list-decimal space-y-3 pl-6 text-[15px] leading-8 first:mt-0 text-slate-600 sm:leading-9 dark:text-slate-300">
							{children}
						</ol>
					),
					blockquote: ({ children }) => (
						<blockquote className="mt-8 space-y-4 rounded-r-[20px] border-l-4 border-sky-200 bg-sky-50/70 px-5 py-5 first:mt-0 dark:border-sky-400/30 dark:bg-sky-500/10">
							{children}
						</blockquote>
					),
					a: ({ href, children }) => {
						const linkClassName =
							"font-medium text-sky-600 underline underline-offset-4 hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200";

						if (href?.startsWith("/")) {
							return (
								<NextLink href={href} className={linkClassName}>
									{children}
								</NextLink>
							);
						}

						return (
							<a
								href={href}
								target="_blank"
								rel="noreferrer noopener"
								className={linkClassName}
							>
								{children}
							</a>
						);
					},
					img: ({ src, alt }) => (
						<img
							src={src ?? ""}
							alt={alt ?? ""}
							loading="lazy"
							className="my-8 w-full rounded-[20px] border border-slate-200 bg-white object-contain shadow-[0_12px_26px_rgba(148,163,184,0.14)] sm:my-10 dark:border-slate-800 dark:bg-slate-950"
						/>
					),
					code: ({ className: codeClassName, children }) => {
						const content = String(children).replace(/\n$/, "");
						const isBlockCode =
							Boolean(codeClassName?.includes("language-")) ||
							content.includes("\n");

						if (!isBlockCode) {
							return (
								<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
									{children}
								</code>
							);
						}

						return (
							<code
								className={cn(
									"my-8 block overflow-x-auto rounded-[22px] bg-slate-950 px-4 py-4 font-mono text-[13px] leading-6 whitespace-pre-wrap text-slate-100",
									codeClassName,
								)}
							>
								{children}
							</code>
						);
					},
					pre: ({ children }) => <>{children}</>,
					hr: () => (
						<hr className="my-10 border-slate-200 dark:border-slate-800" />
					),
				}}
			>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
