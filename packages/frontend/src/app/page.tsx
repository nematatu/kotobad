import Logo from "@/assets/logo/logo.svg";
import LogoMoji from "@/assets/logo/logo-moji.svg";

export default function Page() {
	return (
		<>
			<div className="flex mx-auto justify-center h-[80vh]">
				<div className="mt-20 flex items-center flex-col gap-y-8">
					<div className="flex items-center gap-x-8">
						<Logo className="w-25" />
						<LogoMoji className="w-50" />
					</div>
					<div className="justify-end text-text-emphasis text-2xl font-bold">
						<h1>
							<span>バド</span>
							<span>好きのための</span>
							<span>掲示板</span>
						</h1>
					</div>
				</div>
			</div>
		</>
	);
}
