"use client";

import {
	CheckCircle2,
	ChevronRight,
	LogOut,
	MessageSquare,
	Sparkles,
	ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import DemoLoginButton from "@/components/feature/button/auth/DemoLoginButton";
import LogoutButton from "@/components/feature/button/auth/logoutButton";
import { useUser } from "@/components/feature/provider/UserProvider";
import UserAvatar from "@/components/feature/user/UserAvatar";
import { Button } from "@/components/ui/button";
import { setDemoMode } from "@/lib/auth/demoMode";

export default function DemoPage() {
	const { user, isLoading } = useUser();

	useEffect(() => {
		// /demo にアクセスした時点でデモモードをセッションに有効化
		setDemoMode(true);
	}, []);

	return (
		<main className="container mx-auto max-w-3xl px-4 py-8 sm:py-12">
			{/* ヘッダーバナー */}
			<div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-lg sm:p-10">
				<div className="flex items-center gap-2 text-emerald-200">
					<Sparkles className="h-5 w-5" />
					<span className="text-xs font-bold uppercase tracking-wider">
						Demo Showcase
					</span>
				</div>
				<h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
					コトバド デモ環境
				</h1>
				<p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-50 sm:text-base">
					バドミントン専用掲示板「コトバド」の全機能を、アカウント登録不要ですぐに体験していただけます。
				</p>
			</div>

			{/* ログイン・ステータスセクション */}
			<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
					デモアカウントの利用
				</h2>

				{isLoading ? (
					<div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
				) : user ? (
					<div className="mt-4 space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/50">
							<div className="flex items-center gap-3">
								<UserAvatar />
								<div>
									<div className="flex items-center gap-2">
										<p className="font-bold text-slate-900 dark:text-slate-100">
											{user.name}
										</p>
										<span className="rounded bg-emerald-200 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
											ログイン中
										</span>
									</div>
									<p className="text-xs text-slate-500 dark:text-slate-400">
										{user.email}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<LogoutButton />
							</div>
						</div>

						<div className="flex flex-wrap gap-3 pt-2">
							<Button asChild className="bg-emerald-600 hover:bg-emerald-700">
								<Link href="/threads" className="flex items-center gap-1.5">
									<span>スレッド一覧へ移動</span>
									<ChevronRight className="h-4 w-4" />
								</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/">トップページへ</Link>
							</Button>
						</div>
					</div>
				) : (
					<div className="mt-4 space-y-4">
						<p className="text-sm text-slate-600 dark:text-slate-300">
							下のボタンをクリックすると、ワンクリックで「デモユーザー」としてログインできます。
						</p>
						<div className="max-w-xs">
							<DemoLoginButton className="h-11 text-sm" />
						</div>
					</div>
				)}
			</section>

			{/* デモで体験できる機能 */}
			<section className="mt-8 space-y-4">
				<h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
					体験できる機能
				</h2>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
							<MessageSquare className="h-5 w-5" />
							<h3 className="font-bold">スレッド作成 & 投稿</h3>
						</div>
						<p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
							用具の相談、大会の感想、技術的な質問など自由にスレッドを作成し、レスを投稿できます。
						</p>
					</div>

					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
							<ThumbsUp className="h-5 w-5" />
							<h3 className="font-bold">リアクション機能</h3>
						</div>
						<p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
							共感したスレッドや投稿に「いいね」などのリアクションを瞬時に送信できます。
						</p>
					</div>

					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
							<Sparkles className="h-5 w-5" />
							<h3 className="font-bold">タグ検索 & 絞り込み</h3>
						</div>
						<p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
							ラケット、シューズ、ガット、技術などタグによる高速検索・絞り込みが可能です。
						</p>
					</div>

					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
						<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
							<CheckCircle2 className="h-5 w-5" />
							<h3 className="font-bold">セキュア & 高速</h3>
						</div>
						<p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
							Cloudflare Workers + D1
							によるエッジ配信と厳格なセキュリティ基盤で動作しています。
						</p>
					</div>
				</div>
			</section>

			{/* デモモードの説明と解除 */}
			<section className="mt-8 rounded-xl border border-dashed border-slate-300 p-5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
				<p className="font-bold text-slate-700 dark:text-slate-300">
					💡 デモモードについて
				</p>
				<p className="mt-1 leading-relaxed">
					URLに{" "}
					<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
						?demo=true
					</code>{" "}
					を付与するか、
					<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
						demo.kotobad.com
					</code>{" "}
					からアクセスすることで、ヘッダーやログインモーダルにも「デモログイン」ボタンが表示されます。
				</p>
				<div className="mt-3 flex items-center gap-3">
					<button
						type="button"
						onClick={() => {
							setDemoMode(false);
							window.location.href = "/";
						}}
						className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 underline dark:hover:text-slate-200"
					>
						<LogOut className="h-3.5 w-3.5" />
						<span>通常モードに戻る</span>
					</button>
				</div>
			</section>
		</main>
	);
}
