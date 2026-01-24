import type { TagType } from "@kotobad/shared/src/types/tag";
import type {
	CreateThreadType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { SmilePlus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import IconButton from "@/components/common/button/IconButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { TagList } from "../view/tag/tagList";
import { TagPicker } from "../view/tag/tagPicker";
import { useTagSelection } from "../view/tag/useTagSelection";

type CreateThreadFormProps = {
	onCreated: () => void;
	initialTags?: TagType[];
};

export const CreateThreadForm = ({
	onCreated,
	initialTags,
}: CreateThreadFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

	const form = useForm<CreateThreadType>({
		defaultValues: {
			title: "",
			tagIds: [],
		},
	});

	const { tags, selectedTagIds, toggleTag, resetTagSelection } =
		useTagSelection({ initialTags });
	const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

	const handleSelectTag = (id: number, isSelected: boolean) => {
		const next = isSelected
			? selectedTagIds.filter((t) => t !== id)
			: [...selectedTagIds, id];

		toggleTag(id); // UIの状態更新
		form.setValue("tagIds", next, { shouldDirty: true });
	};

	const handleToggleTagFromList = (id: number) => {
		const isSelected = selectedTagIds.includes(id);
		handleSelectTag(id, isSelected);
	};

	const handleSubmit = async (values: CreateThreadType) => {
		setError(null);
		try {
			const endpoint = await getBffApiUrl("CREATE_THREAD");
			await BffFetcher<ThreadType>(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			onCreated();
			form.reset({ title: "", tagIds: [] });
			resetTagSelection();
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				setError("ログインが必要です");
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
			}
		}
	};

	return (
		<Card className="my-4">
			<div className="w-[100%] p-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-3"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel className="text-md sm:text-xl">
										スレッドタイトル
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											{...form.register("title", {
												required: "タイトルは必須です",
												maxLength: {
													value: 80,
													message: "タイトルは80文字以内で入力してください",
												},
											})}
											placeholder="例: 〇〇の試合について"
											className="w-full sm:h-14 sm:w-1/3 outline-2 focus:border-blue-600 placeholder-gray-500/50"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && <p className="text-red-500">{error}</p>}

						<div className="space-y-2">
							<div className="flex items-start gap-2 w-full">
								<Popover
									open={isTagPopoverOpen}
									onOpenChange={setIsTagPopoverOpen}
								>
									<TooltipProvider delayDuration={3}>
										<Tooltip>
											<TooltipTrigger asChild>
												<PopoverTrigger asChild>
													<IconButton
														enableClickAnimation
														type="button"
														size="icon"
														variant="outline"
														className="group"
														icon={
															<SmilePlus className="text-slate-600 fill-transparent transition-colors group-hover:fill-yellow-300" />
														}
													/>
												</PopoverTrigger>
											</TooltipTrigger>
											<TooltipContent>タグを追加</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<PopoverContent
										align="start"
										className="w-[360px] p-3"
										side="bottom"
										sideOffset={5}
									>
										<div className="flex items-center justify-between">
											<div className="text-sm font-semibold">タグを選択</div>
											<div className="flex items-center gap-2">
												<span className="text-xs text-slate-400">
													{selectedTagIds.length} 件選択中
												</span>
												<IconButton
													enableClickAnimation
													icon={<X className="h-6 w-6 text-slate-600" />}
													onClick={() => setIsTagPopoverOpen(false)}
													className="h-8 w-8 bg-transparent border hover:bg-slate-100"
													aria-label="タグ選択を閉じる"
												/>
											</div>
										</div>
										<p className="mt-1 text-xs text-gray-500">
											クリックで追加/解除できます
										</p>
										<div className="mt-3">
											<TagPicker
												tags={tags}
												selectedTagIds={selectedTagIds}
												onSelect={handleSelectTag}
												isOpen={isTagPopoverOpen}
											/>
										</div>
									</PopoverContent>
								</Popover>
								<div className="flex-1 min-w-0">
									<TagList
										tags={selectedTags}
										onToggle={handleToggleTagFromList}
									/>
								</div>
							</div>
						</div>

						<Button
							className="text-white my-2 cursor-pointer bg-blue-500 hover:bg-blue-600 w-full focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-2"
							type="submit"
						>
							新規スレッド作成
						</Button>
					</form>
				</Form>
			</div>
		</Card>
	);
};
