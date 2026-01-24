import type { TagType } from "@kotobad/shared/src/types/tag";
import type {
	CreateThreadType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { PencilLine } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import IconButton from "@/components/common/button/IconButton";
import UserAvatar from "@/components/feature/user/UserAvatar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { TagList } from "../view/tag/tagList";
import { useTagSelection } from "../view/tag/useTagSelection";
import { TagPickerTooltip } from "./tagPickerTooltip";

type CreateThreadFormProps = {
	onCreated: () => void;
	initialTags?: TagType[];
};

export const CreateThreadForm = ({
	onCreated,
	initialTags,
}: CreateThreadFormProps) => {
	const [error, setError] = useState<string | null>(null);

	const form = useForm<CreateThreadType>({
		defaultValues: {
			title: "",
			tagIds: [],
		},
	});

	const { tags, selectedTagIds, toggleTag, resetTagSelection } =
		useTagSelection({ initialTags });
	const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
	const titleValue = form.watch("title");
	const isSubmitDisabled = !titleValue?.trim();

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
		<section
			aria-labelledby="create-thread-title"
			className="mx-auto w-full max-w-2xl p-4"
		>
			<div className="rounded-2xl bg-white/90">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex gap-2">
									<UserAvatar />
									<div className="flex flex-col space-y-2">
										<FormControl>
											<div>
												<Textarea
													id="thread-title"
													{...field}
													{...form.register("title", {
														required: "空文字は送信出来ません",
														maxLength: {
															value: 80,
															message: "80文字以内で入力してください",
														},
													})}
													onKeyDown={(e) => {
														if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
															e.preventDefault();
															form.handleSubmit(handleSubmit)();
														}
													}}
													placeholder="例: 〇〇の試合について"
													className="w-full border-none resize-none rounded-xl text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[84px]"
												/>

												<p className="hidden sm:block text-neutral-400 text-xs">
													Ctrl + Enter (Macの場合は ⌘ + Enter)で送信できます
												</p>
											</div>
										</FormControl>
										<FormMessage />
										{error && <p className="text-red-500">{error}</p>}
									</div>
								</FormItem>
							)}
						/>

						<div className="space-y-3">
							<div className="h-px w-full bg-slate-200/70" aria-hidden="true" />
							<div className="flex flex-wrap items-start gap-3">
								<div className="min-w-0 flex-1 space-y-3">
									<TagList
										tags={selectedTags}
										onToggle={handleToggleTagFromList}
									/>
									<div className="flex justify-between">
										<TagPickerTooltip
											onSelect={handleSelectTag}
											tags={tags}
											selectedTagIds={selectedTagIds}
										/>

										<IconButton
											hover="brightness"
											icon={<PencilLine />}
											variant="logo1"
											enableClickAnimation
											type="submit"
											disabled={isSubmitDisabled || form.formState.isSubmitting}
										>
											<span className="text-md">投稿</span>
										</IconButton>
									</div>
								</div>
							</div>
						</div>
					</form>
				</Form>
			</div>
		</section>
	);
};
