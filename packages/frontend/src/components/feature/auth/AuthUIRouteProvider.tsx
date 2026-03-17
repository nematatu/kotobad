"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import { Link as TransitionLink } from "@/components/common/Link";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";
import { authClient } from "@/lib/auth/auth-client";

const AuthLink = (props: ComponentProps<typeof TransitionLink>) => (
	<TransitionLink {...props} showIndicator={false} />
);

export default function AuthUIRouteProvider({
	children,
}: {
	children: ReactNode;
}) {
	const router = useRouter();
	const transitionRouter = useViewTransitionRouter();

	return (
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
			{children}
		</AuthUIProvider>
	);
}
