type HeaderNavLink = {
	name: string;
	link: string;
	label?: React.ReactNode;
};

export const headerNavLinks: HeaderNavLink[] = [
	{ name: "スレッド一覧", link: "/threads" },
	{ name: "コトバドとは", link: "/#about" },
];
