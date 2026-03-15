"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { Suspense } from "react";
import { Link as TransitionLink } from "@/components/common/Link";
import PwaPullToRefresh from "@/components/feature/navigation/PwaPullToRefresh";
import ViewTransitionStateSync from "@/components/feature/navigation/ViewTransitionStateSync";
import { ThreadBottomComposerProvider } from "@/components/feature/provider/ThreadBottomComposerProvider";
import { UserProvider } from "@/components/feature/provider/UserProvider";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";
import { authClient } from "@/lib/auth/auth-client";

const AuthLink = (props: ComponentProps<typeof TransitionLink>) => (
	<TransitionLink {...props} showIndicator={false} />
);

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();
	const transitionRouter = useViewTransitionRouter();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			storageKey="kotobad-theme"
		>
			<AuthUIProvider
				authClient={authClient}
				navigate={transitionRouter.push}
				replace={transitionRouter.replace}
				onSessionChange={() => {
					router.refresh();
				}}
				Link={AuthLink}
				social={{ providers: ["google"] }}
			>
				<UserProvider>
					<ThreadBottomComposerProvider>
						<Suspense fallback={null}>
							<ViewTransitionStateSync />
						</Suspense>
						<PwaPullToRefresh />
						{children}
					</ThreadBottomComposerProvider>
				</UserProvider>
			</AuthUIProvider>
		</ThemeProvider>
	);
}
