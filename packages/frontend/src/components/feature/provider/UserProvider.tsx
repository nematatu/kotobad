"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import type { BetterAuthUser } from "@/lib/auth/betterAuthSession";

// undefined: ローディング中
// null: 未ログイン
// BetterAuthUser: ログイン中
export type User = BetterAuthUser | null;
export type UserState = User | undefined;

type Ctx = {
	user: UserState;
	setUser: (u: User) => void;
	isLoading: boolean;
};

const UserContext = createContext<Ctx | undefined>(undefined);

export function UserProvider({
	children,
	initialUser,
}: {
	children: React.ReactNode;
	initialUser?: UserState;
}) {
	const [user, setUser] = useState<UserState>(initialUser);
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
		<UserContext.Provider value={{ user, setUser, isLoading: isPending }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used inside UserProvider");
	return ctx;
}
