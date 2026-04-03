import type { TagType } from "@kotobad/shared/src/types/tag";
import type {
	CreateThreadType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import IconButton from "@/components/common/button/IconButton";
import UserAvatar from "@/components/feature/user/UserAvatar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Kbd } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { useThreadPostImageInput } from "../../lib/useThreadPostImageInput";
import {
	ThreadPostImagePicker,
	ThreadPostImagePreviewGrid,
} from "../shared/ThreadPostImagePicker";
import { TagList } from "../view/tag/tagList";
import { useTagSelection } from "../view/tag/useTagSelection";
import { TagPickerTooltip } from "./tagPickerTooltip";

type CreateThreadFormProps = {
	onCreated: () => void;
	initialTags?: TagType[];
	autoFocusTitle?: boolean;
};

export const CreateThreadForm = ({
	onCreated,
	initialTags,
	autoFocusTitle = false,
}: CreateThreadFormProps) => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const {
		imagePreviewUrls,
		maxImages,
		imageInputRef,
		selectImageAction,
		openImageDialogAction,
		clearImageSelectionAction,
		removeImageAtAction,
		uploadSelectedImagesAction,
	} = useThreadPostImageInput({ maxImages: 2 });

	const form = useForm<CreateThreadType>({
		defaultValues: {
			title: "",
			imageUrls: [],
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
			const imageUrls = await uploadSelectedImagesAction("thread");
			const endpoint = await getBffApiUrl("CREATE_THREAD");
			const createdThread = await BffFetcher<ThreadType>(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...values,
					imageUrls,
				}),
			});

			onCreated();
			form.reset({ title: "", imageUrls: [], tagIds: [] });
			resetTagSelection();
			clearImageSelectionAction();
			toast.success("投稿しました!");
			router.push(`/threads/${createdThread.id}`);
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				return;
			} else {
				const message =
					error instanceof Error ? error.message : "不明なエラーが発生しました";
				setError(message);
				toast.error(message);
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
						className="flex flex-col space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex gap-2">
									<UserAvatar />
									<div className="flex min-w-0 flex-1 flex-col space-y-2">
										<FormControl>
											<div>
												<Textarea
													id="thread-title"
													autoFocus={autoFocusTitle}
													rows={1}
													{...field}
													{...form.register("title", {
														required: "空文字は送信出来ません",
														maxLength: {
															value: 80,
															message: "80文字以内で入力してください",
														},
													})}
													onInput={(event) => {
														const element = event.currentTarget;
														element.style.height = "0px";
														element.style.height = `${element.scrollHeight}px`;
													}}
													onKeyDown={(e) => {
														if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
															e.preventDefault();
															form.handleSubmit(handleSubmit)();
														}
													}}
													placeholder="例: 〇〇の試合について"
													className="min-h-10 w-full overflow-hidden border-none resize-none rounded-xl py-2 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
												/>
											</div>
										</FormControl>
										<FormMessage />
										{error && <p className="text-red-500">{error}</p>}
										<ThreadPostImagePreviewGrid
											imagePreviewUrls={imagePreviewUrls}
											onRemoveImageAction={removeImageAtAction}
										/>
									</div>
								</FormItem>
							)}
						/>

						<div className="space-y-3">
							<div className="h-px w-full bg-slate-200/70" aria-hidden="true" />
							<div className="min-w-0 flex-1 space-y-3">
								<TagList
									tags={selectedTags}
									onToggle={handleToggleTagFromList}
								/>
								<div className="flex justify-between">
									<div className="flex">
										<ThreadPostImagePicker
											imageInputRef={imageInputRef}
											imagePreviewUrls={imagePreviewUrls}
											maxImages={maxImages}
											onSelectImageAction={selectImageAction}
											onOpenImageDialogAction={openImageDialogAction}
											onRemoveImageAction={removeImageAtAction}
											showPreview={false}
										/>
										<TagPickerTooltip
											onSelect={handleSelectTag}
											tags={tags}
											selectedTagIds={selectedTagIds}
										/>
									</div>

									<div className="flex space-x-3 items-end">
										<IconButton
											hover="brightness"
											icon={<PencilLine />}
											variant="zenn-like"
											rounded="full"
											type="submit"
											disabled={isSubmitDisabled || form.formState.isSubmitting}
										>
											<span className="text-md">投稿</span>
											<div className="hidden md:block">
												<Kbd>⌘ + Enter</Kbd>
											</div>
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
