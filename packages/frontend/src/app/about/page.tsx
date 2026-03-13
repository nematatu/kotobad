import LogoStickerIcon from "@/assets/logo/logo-sticker.svg";
export default async function Page() {
	return (
		<div className="relative min-h-screen bg-[#f8fbff] dark:bg-[#0f172a]">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed right-0 bottom-24 z-0 rotate-[-10deg] opacity-15 sm:bottom-12"
			>
				<LogoStickerIcon className="h-26 sm:h-47" />
			</div>

			<section className="relative bg-gray-200/60 dark:bg-gray-800/60 overflow-hidden border-b border-slate-200/80">
				<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 sm:pt-26">
					<div className="mx-auto max-w-3xl space-y-5 text-center">
						<h1 className="text-2xl font-black tracking-[0.12em] text-slate-950 dark:text-slate-50 sm:text-4xl">
							What's コトバド？
						</h1>
					</div>
				</div>
			</section>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
				<div className="flex flex-col gap-y-4 max-w-5xl mx-auto p-4">
					<section className="space-y-2">
						<div className="py-2 text-sm text-slate-500">
							<p>バドミントンを語り合うための掲示板サイトです。</p>
							<p>
								<strong className="text-lg text-blue-700 underline underline-offset-2">
									{" "}
									もっとバドミントンを語りたい。
								</strong>
								一緒に盛り上がりたい。
								<strong className="text-lg text-blue-700 underline underline-offset-2">
									熱狂したい。
								</strong>
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
