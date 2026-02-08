import { ArrowRight, List, Search } from "lucide-react";
import Image from "next/image";
import LogoIcon from "@/assets/logo/logo.svg";
import LogoMojiIcon from "@/assets/logo/logo-moji.svg";
import { Link } from "@/components/common/Link";

export default function AboutPage() {
	return (
		<div className="relative isolate ">
			<div className="absolute inset-0 -z-10 ">
				<Image
					src="/selfie/IMG_2735_Original.jpg"
					alt=""
					fill
					className="min-h-screen object-cover"
				/>
			</div>

			<section className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6">
				<div className="animate-fade-in-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-float backdrop-blur sm:p-10">
					<div className="pointer-events-none absolute inset-0 opacity-10">
						<div className="absolute inset-6 rounded-2xl border-2 border-emerald-700" />
						<div className="absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-emerald-700" />
						<div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-emerald-700" />
					</div>

					<div className="relative z-10 flex flex-col items-start">
						<div className="flex items-center gap-4">
							<div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-soft sm:h-24 sm:w-24">
								<LogoIcon className="h-12 w-12 sm:h-14 sm:w-14" />
							</div>
							<LogoMojiIcon className="h-11 w-auto text-slate-900 sm:h-14" />
						</div>

						<h1 className="mt-6 text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">
							バドミントンの話題を
							<br />
							すぐ見つけて、すぐ話せる。
						</h1>
						<p className="mt-4 text-sm text-slate-600 sm:text-base">
							コトバドは、バドミントン特化の掲示板アプリです。
						</p>

						<div className="mt-6 grid w-full gap-3 sm:grid-cols-[1fr_auto]">
							<form
								action="/threads"
								method="get"
								className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card"
							>
								<label htmlFor="about-thread-search" className="sr-only">
									スレッド検索
								</label>
								<div className="relative">
									<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<input
										id="about-thread-search"
										name="q"
										type="search"
										placeholder="スレッドを検索"
										className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
									/>
								</div>
							</form>

							<Link
								href="/threads"
								className="inline-flex h-full min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500"
							>
								<List className="h-4 w-4" />
								スレッド一覧
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>

						<div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
							<span className="rounded-full bg-slate-100 px-3 py-1">検索</span>
							<span className="rounded-full bg-slate-100 px-3 py-1">一覧</span>
							<span className="rounded-full bg-slate-100 px-3 py-1">投稿</span>
						</div>
					</div>

					<div className="pointer-events-none absolute bottom-3 right-3 w-28 opacity-20 sm:w-36">
						<Image
							src="/file.svg"
							alt=""
							aria-hidden="true"
							width={243}
							height={213}
							className="h-auto w-full"
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
