"use client";

import { ArrowLeft } from "lucide-react";
import ActionLink from "@/components/common/button/ActionLink";

export default function NotFound() {
	return (
		<div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
			<h1 className="text-2xl font-bold text-slate-700">
				ページが見つかりません
			</h1>
			<p className="text-sm text-slate-500">
				このページはすでに削除されているか、URLが間違っている可能性があります。
			</p>
			<img
				src="/404-illustration.svg"
				alt="ページが見つかりません"
				className="w-96"
			/>
			<div className="pt-2">
				<ActionLink
					item={{
						icon: ArrowLeft,
						label: "ホームに戻る",
						href: "/",
					}}
				/>
			</div>
		</div>
	);
}
