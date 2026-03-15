"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const THREAD_DETAIL_PATHNAME = /^\/threads\/[^/]+$/;

export default function ConditionalFooter() {
	const pathname = usePathname();
	const isThreadDetailPage = THREAD_DETAIL_PATHNAME.test(pathname);

	if (isThreadDetailPage) {
		return null;
	}

	return <Footer />;
}
