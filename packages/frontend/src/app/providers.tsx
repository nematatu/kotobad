"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { UserProvider } from "@/components/feature/provider/UserProvider";
import { authClient } from "@/lib/auth/auth-client";

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<AuthUIProvider
			authClient={authClient}
			navigate={router.push}
			replace={router.replace}
			onSessionChange={() => {
				router.refresh();
			}}
			Link={Link}
			social={{ providers: ["google"] }}
		>
			<UserProvider>{children}</UserProvider>
		</AuthUIProvider>
	);
}
