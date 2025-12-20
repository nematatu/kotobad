"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/components/feature/provider/UserProvider";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/auth-client";

const LogoutButton = () => {
	const router = useRouter();
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
		<Button onClick={handleLogout} variant="destructive" disabled={isPending}>
			ログアウト
		</Button>
	);
};

export default LogoutButton;
