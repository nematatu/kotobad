"use client";
import { useState, useContext, createContext } from "react";
import { UserJWTType } from "@b3s/shared/src/types/auth";

export type User = UserJWTType | null;

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
