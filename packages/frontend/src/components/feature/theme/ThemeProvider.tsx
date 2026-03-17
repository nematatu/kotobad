"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = "kotobad-theme";
const THEME_CLASS_NAMES = ["light", "dark"] as const;

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getSystemTheme = (): ResolvedTheme => {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

const normalizeStoredTheme = (value: string | null): Theme => {
	return value === "light" || value === "dark" ? value : "system";
};

const getInitialResolvedTheme = (): ResolvedTheme => {
	if (typeof document !== "undefined") {
		return document.documentElement.classList.contains("dark")
			? "dark"
			: "light";
	}
	return "light";
};

const readStoredTheme = (): Theme => {
	if (typeof window === "undefined") {
		return "system";
	}

	try {
		return normalizeStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
	} catch (error) {
		console.warn("Failed to read theme from localStorage.", error);
		return "system";
	}
};

const persistTheme = (theme: Theme) => {
	if (typeof window === "undefined") {
		return;
	}

	try {
		if (theme === "system") {
			window.localStorage.removeItem(THEME_STORAGE_KEY);
			return;
		}
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch (error) {
		console.warn("Failed to persist theme to localStorage.", error);
	}
};

const applyResolvedTheme = (resolvedTheme: ResolvedTheme) => {
	if (typeof document === "undefined") {
		return;
	}

	const root = document.documentElement;
	root.classList.remove(...THEME_CLASS_NAMES);
	root.classList.add(resolvedTheme);
	root.style.colorScheme = resolvedTheme;
};

export function AppThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
		getInitialResolvedTheme,
	);

	const setTheme = useCallback((nextTheme: Theme) => {
		const nextResolvedTheme =
			nextTheme === "system" ? getSystemTheme() : nextTheme;

		setThemeState(nextTheme);
		setResolvedTheme(nextResolvedTheme);
		persistTheme(nextTheme);
		applyResolvedTheme(nextResolvedTheme);
	}, []);

	useEffect(() => {
		const storedTheme = readStoredTheme();
		const nextResolvedTheme =
			storedTheme === "system" ? getSystemTheme() : storedTheme;

		setThemeState(storedTheme);
		setResolvedTheme(nextResolvedTheme);
		applyResolvedTheme(nextResolvedTheme);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const onMediaQueryChange = () => {
			if (theme !== "system") {
				return;
			}

			const nextResolvedTheme: ResolvedTheme = mediaQuery.matches
				? "dark"
				: "light";
			setResolvedTheme(nextResolvedTheme);
			applyResolvedTheme(nextResolvedTheme);
		};

		mediaQuery.addEventListener("change", onMediaQueryChange);
		return () => {
			mediaQuery.removeEventListener("change", onMediaQueryChange);
		};
	}, [theme]);

	const value = useMemo<ThemeContextValue>(() => {
		return {
			theme,
			resolvedTheme,
			setTheme,
		};
	}, [theme, resolvedTheme, setTheme]);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within AppThemeProvider.");
	}
	return context;
};
