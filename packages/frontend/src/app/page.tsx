import Link from "next/link";

export default function Page() {
	return (
		<div className="flex flex-col gap-y-4">
			<Link href="/threads">
				<div className="text-blue-400 underline font-bold text-3xl">
					スレッド一覧へ
				</div>
			</Link>
		</div>
	);
}
