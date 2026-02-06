"use client";

import { SiGithub, SiX } from "react-icons/si";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import { Link } from "@/components/common/Link";
import type { FooterItem } from "./FooterItem";
import { FOOTER_SECTIONS } from "./FooterItem";

const FooterItemLink = ({ item }: { item: FooterItem }) => {
	const icon =
		item.icon === "github" ? (
			<SiGithub className="h-3.5 w-3.5 text-slate-500" />
		) : item.icon === "twitter" ? (
			<SiX className="h-3.5 w-3.5 text-slate-500" />
		) : null;
	const badge = item.badge ? (
		<span className="rounded border border-blue-400 px-1.5 py-[1px] text-[10px] font-semibold text-blue-500">
			{item.badge}
		</span>
	) : null;
	const linkClass =
		"inline-flex items-center gap-2 self-start text-slate-600 hover:text-slate-900 hover:underline underline-offset-4";

	if (item.external) {
		return (
			<a
				href={item.href}
				target="_blank"
				rel="noreferrer"
				className={linkClass}
			>
				{icon}
				<span>{item.label}</span>
				{badge}
			</a>
		);
	}

	return (
		<Link href={item.href} className={linkClass}>
			{icon}
			<span>{item.label}</span>
			{badge}
		</Link>
	);
};

const Footer = () => {
	return (
		<footer className="border-t border-slate-200 bg-surface-50">
			<div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
				<div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:gap-x-14 lg:gap-y-10">
					<div className="space-y-3 sm:space-y-4">
						<Link href="/" className="inline-flex items-center gap-2">
							<LogoIcon className="h-9 w-9 sm:h-10 sm:w-10" />
							<LogoMojiIcon className="h-5 w-auto sm:h-6" />
						</Link>
						<p className="text-sm text-slate-600 leading-relaxed max-w-[220px]">
							バド好きのための掲示板
						</p>
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:gap-x-10 sm:gap-y-6 lg:col-span-4 lg:grid-cols-4 lg:gap-x-12">
						{FOOTER_SECTIONS.map((section) => (
							<section
								className="space-y-2 text-[11px] sm:space-y-3 sm:text-sm"
								key={section.title}
								aria-label={section.title}
							>
								<div className="text-xs font-semibold text-slate-800 sm:text-base">
									{section.title}
								</div>
								<div className="flex flex-col gap-1.5 sm:gap-2">
									{section.items.map((item) => (
										<FooterItemLink
											key={`${section.title}-${item.label}`}
											item={item}
										/>
									))}
								</div>
							</section>
						))}
					</div>
				</div>
			</div>
			<div className="border-t border-slate-200 bg-surface-50">
				<div className="mx-auto max-w-6xl px-4 py-3 text-xs text-slate-500 sm:px-6 sm:py-4">
					© 2026 kotobad
				</div>
			</div>
		</footer>
	);
};

export default Footer;
