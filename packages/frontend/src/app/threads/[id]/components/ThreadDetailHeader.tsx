import type { ThreadType } from "@kotobad/shared/src/types/thread";

type Props = {
	threadHeaderData: ThreadType;
};

export const ThreadDetailHeader = ({ threadHeaderData }: Props) => {
	return (
		<div className="flex justify-center my-8 sm:my-13">
			<h1 className="max-w-4xl text-left text-lg sm:text-2xl font-bold break-words">
				{threadHeaderData.title}
			</h1>
		</div>
	);
};
