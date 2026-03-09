"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import IconButton from "@/components/common/button/IconButton";
import { useUser } from "@/components/feature/provider/UserProvider";
import { useViewTransitionRouter } from "@/hooks/useViewTransitionRouter";
import { signOut } from "@/lib/auth/auth-client";

const LogoutButton = () => {
	const router = useViewTransitionRouter();
	const { setUser } = useUser();
	const [isPending, setIsPending] = useState(false);

	const handleLogout = async () => {
		if (isPending) return;
		setIsPending(true);
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						setUser(null);
						router.replace("/");
						router.refresh();
					},
				},
			});
		} finally {
			setIsPending(false);
		}
	};

	return (
		<IconButton
			variant="destructive"
			size="sm"
			icon={<LogOut />}
			onClick={handleLogout}
			disabled={isPending}
		>
			ログアウト
		</IconButton>
	);
};

export default LogoutButton;
