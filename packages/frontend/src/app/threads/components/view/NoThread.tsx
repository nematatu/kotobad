import Image from "next/image";

type props = {
	query: string;
};

export default function NoThread({ query }: props) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[45vh] overflow-hidden space-y-15">
			<div className="text-md text-slate-500 font-semibold text-center space-y-4">
				<p>「{query}」 に一致するスレッドは見つかりませんでした</p>
				<p>投稿してみましょう !</p>
			</div>
			<Image
				src="/Designing.svg"
				alt=""
				aria-hidden="true"
				width={300}
				height={300}
				className="w-[40%] object-contain opacity-20"
			/>
		</div>
	);
}
