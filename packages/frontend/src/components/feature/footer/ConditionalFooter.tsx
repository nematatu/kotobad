"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const THREAD_DETAIL_PATHNAME = /^\/threads\/[^/]+$/;
const SETTINGS_PATHNAME = /^\/settings(?:\/|$)/;

export default function ConditionalFooter() {
	const pathname = usePathname();
	const isThreadDetailPage = THREAD_DETAIL_PATHNAME.test(pathname);
	const isSettingsPage = SETTINGS_PATHNAME.test(pathname);

	if (isThreadDetailPage || isSettingsPage) {
		return null;
	}

	return <Footer />;
}
