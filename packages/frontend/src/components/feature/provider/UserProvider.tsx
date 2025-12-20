"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import type { BetterAuthUser } from "@/lib/auth/betterAuthSession";

export type User = BetterAuthUser | null;

type Ctx = {
	user: User;
	setUser: (u: User) => void;
};

const UserContext = createContext<Ctx | undefined>(undefined);

export function UserProvider({
	children,
	initialUser,
}: {
	children: React.ReactNode;
	initialUser: User;
}) {
	const [user, setUser] = useState<User>(initialUser);
	const { data, isPending } = useSession();

	useEffect(() => {
		if (isPending) return;
		if (data?.user) {
			setUser(data.user);
			return;
		}
		setUser(null);
	}, [data, isPending]);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used inside UserProvider");
	return ctx;
}
