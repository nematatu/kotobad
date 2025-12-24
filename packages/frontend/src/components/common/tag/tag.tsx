type TagProps = {
	label: string;
};

export default function Tag({ label }: TagProps) {
	return (
		<span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20">
			<div className="mr-1 h-2 w-2 rounded-full bg-white" />
			<span>{label}</span>
		</span>
	);
}
