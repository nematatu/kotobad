import { Button } from "@/components/ui/button";

export default function Page() {
	return (
		<div className="flex flex-col gap-y-4">
			<div className="w-32 h-32 p-2 bg-blue-400">
				<Button variant="outline" size="lg" className="w-full">
					hello
				</Button>
			</div>
			<div className="w-32 h-32 p-2 bg-blue-400">
				<Button variant="outline" size="lg" className="w-full">
					world
				</Button>
			</div>
		</div>
	);
}
