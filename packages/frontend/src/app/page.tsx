export default async function Page() {
	return (
		<div className="flex flex-col gap-y-4 max-w-5xl mx-auto p-4">
			<h1 className="text-3xl font-bold text-slate-800">コトバドとは？</h1>
			<div className="py-2 text-sm text-slate-500">
				<p>コトバドは、バドミントンを語り合うための掲示板サイトです。</p>
				<p>
					世の中のバドオタク達！
					<strong className="text-lg text-blue-700 underline underline-offset-2">
						バドミントンのこと、 満足に語れてる?
					</strong>
				</p>
				<p>
					俺は語れてない。 もっとお前らと喋りたい。
					<strong className="text-lg text-blue-700 underline underline-offset-2">
						{" "}
						もっとバドミントンを語りたい。
					</strong>
					一緒に盛り上がりたい。
					<strong className="text-lg text-blue-700 underline underline-offset-2">
						熱狂したい。
					</strong>
				</p>
				<p>なのでこのサイトを作成しました。</p>
			</div>
			<h1 className="text-2xl font-bold text-slate-700">トレンド</h1>
		</div>
	);
}
