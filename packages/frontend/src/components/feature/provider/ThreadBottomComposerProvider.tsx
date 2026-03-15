"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type ThreadBottomComposerContextValue = {
	isExpanded: boolean;
	setIsExpanded: (isExpanded: boolean) => void;
};

const ThreadBottomComposerContext =
	createContext<ThreadBottomComposerContextValue | null>(null);

export function ThreadBottomComposerProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const value = useMemo(
		() => ({
			isExpanded,
			setIsExpanded,
		}),
		[isExpanded],
	);

	return (
		<ThreadBottomComposerContext.Provider value={value}>
			{children}
		</ThreadBottomComposerContext.Provider>
	);
}

export function useThreadBottomComposer() {
	const context = useContext(ThreadBottomComposerContext);
	if (!context) {
		throw new Error(
			"useThreadBottomComposer must be used inside ThreadBottomComposerProvider",
		);
	}
	return context;
}
