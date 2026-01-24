import type { TagType } from "@kotobad/shared/src/types/tag";
import type {
	CreateThreadType,
	ThreadType,
} from "@kotobad/shared/src/types/thread";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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
			className="mx-auto mt-6 w-full max-w-2xl px-4 sm:px-0"
		>
			<div className="rounded-2xl bg-white/90 p-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-2">
									<FormLabel className="text-sm font-medium text-slate-600">
										スレッドタイトル
									</FormLabel>
									<FormControl>
										<Textarea
											id="thread-title"
											{...field}
											{...form.register("title", {
												required: "タイトルは必須です",
												maxLength: {
													value: 80,
													message: "タイトルは80文字以内で入力してください",
												},
											})}
											placeholder="例: 〇〇の試合について"
											className="w-full border-none resize-none rounded-xl px-4 py-3 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:min-h-[84px]"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && <p className="text-red-500">{error}</p>}

						<div className="space-y-3">
							<div className="h-px w-full bg-slate-200/70" aria-hidden="true" />
							<div className="flex flex-wrap items-start gap-3">
								<div className="min-w-0 flex-1">
									<TagList
										tags={selectedTags}
										onToggle={handleToggleTagFromList}
									/>
									<TagPickerTooltip
										onSelect={handleSelectTag}
										tags={tags}
										selectedTagIds={selectedTagIds}
									/>
								</div>
							</div>
						</div>

						<Button
							className="w-full rounded-full bg-slate-900 text-white transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
							type="submit"
							disabled={isSubmitDisabled || form.formState.isSubmitting}
						>
							作成
						</Button>
					</form>
				</Form>
			</div>
		</section>
	);
};
