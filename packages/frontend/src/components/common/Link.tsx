"use client";

import NextLink, {
	type LinkProps as NextLinkProps,
	useLinkStatus,
} from "next/link";
import type * as React from "react";

type LinkProps = NextLinkProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		children: React.ReactNode;
		className?: string;
		showIndicator?: boolean;
	};

function LinkIndicator() {
	const { pending } = useLinkStatus();
	return pending ? <span className="link-progress" aria-hidden="true" /> : null;
}

export function Link({
	children,
	className,
	showIndicator = true,
	...props
}: LinkProps) {
	return (
		<NextLink {...props} className={className}>
			{children}
			{showIndicator ? <LinkIndicator /> : null}
		</NextLink>
	);
}
