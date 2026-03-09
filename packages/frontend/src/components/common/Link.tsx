"use client";

import NextLink, {
	type LinkProps as NextLinkProps,
	useLinkStatus,
} from "next/link";
import type * as React from "react";
import { createPortal } from "react-dom";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";

type LinkProps = NextLinkProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		children: React.ReactNode;
		className?: string;
		showIndicator?: boolean;
	};

function LinkIndicator() {
	const { pending } = useLinkStatus();
	if (!pending || typeof document === "undefined") {
		return null;
	}

	return createPortal(
		<span className="link-progress" aria-hidden="true" />,
		document.body,
	);
}

export function Link({
	children,
	className,
	showIndicator = true,
	href,
	onNavigate,
	replace,
	scroll,
	...props
}: LinkProps) {
	const transitionRouter = useViewTransitionRouter();

	return (
		<NextLink
			{...props}
			href={href}
			replace={replace}
			scroll={scroll}
			className={className}
			onNavigate={(event) => {
				let prevented = false;
				onNavigate?.({
					preventDefault: () => {
						prevented = true;
						event.preventDefault();
					},
				});

				if (prevented) {
					return;
				}

				event.preventDefault();
				if (replace) {
					transitionRouter.replace(href, { scroll });
					return;
				}
				transitionRouter.push(href, { scroll });
			}}
		>
			{children}
			{showIndicator ? <LinkIndicator /> : null}
		</NextLink>
	);
}
