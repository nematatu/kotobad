"use client";

import NextLink, {
	type LinkProps as NextLinkProps,
	useLinkStatus,
} from "next/link";
import type * as React from "react";
import { createPortal } from "react-dom";

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
	...props
}: LinkProps) {
	return (
		<NextLink {...props} className={className}>
			{children}
			{showIndicator ? <LinkIndicator /> : null}
		</NextLink>
	);
}
