(() => {
	const storageKey = "kotobad-theme";
	try {
		const storedTheme = window.localStorage.getItem(storageKey);
		const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const resolvedTheme =
			storedTheme === "light" || storedTheme === "dark"
				? storedTheme
				: systemPrefersDark
					? "dark"
					: "light";

		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(resolvedTheme);
		document.documentElement.style.colorScheme = resolvedTheme;
	} catch {}
})();
