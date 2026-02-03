type HeaderNavLink = {
	name: string;
	link: string;
	label?: React.ReactNode;
};

export const headerNavLinks: HeaderNavLink[] = [
	{ name: "ホーム", link: "/" },
	{ name: "スレッド一覧", link: "/threads" },
	{ name: "観戦ラウンジ", link: "/#lounge" },
	{ name: "コトバドとは", link: "/#about" },
	{ name: "Proプラン", link: "/#pro" },
];
