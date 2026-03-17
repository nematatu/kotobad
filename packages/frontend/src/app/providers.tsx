"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import PwaPullToRefresh from "@/components/feature/navigation/PwaPullToRefresh";
import ViewTransitionStateSync from "@/components/feature/navigation/ViewTransitionStateSync";
import { UserProvider } from "@/components/feature/provider/UserProvider";
import { AppThemeProvider } from "@/components/feature/theme/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<AppThemeProvider>
			<UserProvider>
				<Suspense fallback={null}>
					<ViewTransitionStateSync />
				</Suspense>
				<PwaPullToRefresh />
				{children}
			</UserProvider>
		</AppThemeProvider>
	);
}
