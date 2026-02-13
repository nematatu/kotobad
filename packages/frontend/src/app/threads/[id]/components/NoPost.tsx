import Image from "next/image";

export default function NoPost() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[45vh] overflow-hidden space-y-5">
			<Image
				src="/file.svg"
				alt=""
				aria-hidden="true"
				width={300}
				height={300}
				className="w-[40%] object-contain opacity-20"
			/>
			<p className="text-md text-slate-500 font-semibold">
				投稿してみましょう !
			</p>
		</div>
	);
}
