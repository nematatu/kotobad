"use client";

import type {
	CreateDeveloperNoteType,
	DeveloperNoteKindType,
	DeveloperNoteStatusType,
} from "@kotobad/shared/src/types/developerNote";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import {
	DEVELOPER_NOTE_KIND_META,
	DEVELOPER_NOTE_KIND_ORDER,
	DEVELOPER_NOTE_STATUS_META,
	DEVELOPER_NOTE_STATUS_ORDER,
} from "../lib/meta";

const getErrorMessage = (error: unknown) => {
	if (!(error instanceof Error)) {
		return "不明なエラーが発生しました";
	}

	const fetchError = error as BffFetcherError;
	if (fetchError.body) {
		try {
			const parsed = JSON.parse(fetchError.body) as { error?: string };
			if (parsed.error) {
				return parsed.error;
			}
		} catch {
			return error.message;
		}
	}

	return error.message;
};

export function CreateDeveloperNoteForm() {
	const router = useRouter();
	const [submitError, setSubmitError] = useState<string | null>(null);
	const form = useForm<CreateDeveloperNoteType>({
		defaultValues: {
			content: "",
			kind: "log",
			status: "wip",
		},
	});

	const contentValue = form.watch("content");
	const kindValue = form.watch("kind");
	const statusValue = form.watch("status");
	const isSubmitDisabled = !contentValue?.trim();
	const kindOptions = DEVELOPER_NOTE_KIND_ORDER.map((kind) => ({
		kind,
		meta: DEVELOPER_NOTE_KIND_META[kind],
	}));
	const statusOptions = DEVELOPER_NOTE_STATUS_ORDER.map((status) => ({
		status,
		meta: DEVELOPER_NOTE_STATUS_META[status],
	}));

	const handleSelectKind = (kind: DeveloperNoteKindType) => {
		form.setValue("kind", kind, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const handleSelectStatus = (status: DeveloperNoteStatusType) => {
		form.setValue("status", status, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const handleSubmit = async (values: CreateDeveloperNoteType) => {
		setSubmitError(null);

		try {
			const endpoint = await getBffApiUrl("CREATE_DEVELOPER_NOTE");
			await BffFetcher(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			form.reset({
				content: "",
				kind: "log",
				status: "wip",
			});
			toast.success("ボヤキを投稿しました");
			router.refresh();
		} catch (error: unknown) {
			const fetchError = error as BffFetcherError;
			if (fetchError.status === 401) {
				return;
			}

			const message = getErrorMessage(error);
			setSubmitError(message);
			toast.error(message);
		}
	};

	return (
		<section
			aria-labelledby="create-developer-note-title"
			className="rounded-[28px] border border-slate-200/80 bg-white/88 px-5 py-5 shadow-[0_12px_26px_rgba(148,163,184,0.14)] backdrop-blur md:px-6 md:py-6 dark:border-slate-800 dark:bg-slate-900/72"
		>
			<div className="space-y-2">
				<p className="text-[11px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
					PRIVATE POST
				</p>
				<h2
					id="create-developer-note-title"
					className="text-[20px] font-bold tracking-[0.08em] text-slate-950 dark:text-slate-50"
				>
					今やっていることを投げる
				</h2>
				<p className="text-[14px] leading-7 text-slate-500 dark:text-slate-300">
					進捗ログと雑感メモを、あとから見返しやすい形でそのまま積みます。
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="mt-5 space-y-5"
				>
					<FormField
						control={form.control}
						name="kind"
						render={() => (
							<FormItem>
								<div className="flex flex-wrap gap-2">
									{kindOptions.map(({ kind, meta }) => (
										<button
											key={kind}
											type="button"
											onClick={() => handleSelectKind(kind)}
											className={cn(
												"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold tracking-[0.12em] transition-colors",
												kindValue === kind
													? meta.selectedClass
													: meta.idleClass,
											)}
										>
											<span>{meta.label}</span>
											<span className="text-[11px] font-medium tracking-normal opacity-75">
												{meta.description}
											</span>
										</button>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="status"
						render={() => (
							<FormItem>
								<div className="flex flex-wrap gap-2">
									{statusOptions.map(({ status, meta }) => (
										<button
											key={status}
											type="button"
											onClick={() => handleSelectStatus(status)}
											className={cn(
												"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold tracking-[0.12em] transition-colors",
												statusValue === status
													? meta.selectedClass
													: meta.idleClass,
											)}
										>
											<span>{meta.label}</span>
											<span className="text-[11px] font-medium tracking-normal opacity-75">
												{meta.description}
											</span>
										</button>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="flex gap-3">
								<div className="pt-1">
									<UserAvatar />
								</div>
								<div className="min-w-0 flex-1 space-y-3">
									<FormControl>
										<Textarea
											{...field}
											{...form.register("content", {
												required: "空文字では投稿できません",
												maxLength: {
													value: 4000,
													message: "4000文字以内で入力してください",
												},
											})}
											onKeyDown={(event) => {
												if (
													event.key === "Enter" &&
													(event.ctrlKey || event.metaKey)
												) {
													event.preventDefault();
													form.handleSubmit(handleSubmit)();
												}
											}}
											placeholder="例: 検索結果の並び順を再調整中。雑感なら NOTE、進捗なら LOG として残します。"
											className="min-h-[168px] resize-none rounded-[24px] border-slate-200 bg-white/70 px-5 py-4 text-[15px] leading-8 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-50"
										/>
									</FormControl>
									<FormMessage />
									{submitError ? (
										<p className="text-sm text-rose-500">{submitError}</p>
									) : null}
								</div>
							</FormItem>
						)}
					/>

					<div className="flex flex-col gap-3 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
						<p className="text-[12px] text-slate-400 dark:text-slate-500">
							Ctrl + Enter（Mac は ⌘ + Enter）で送信できます
						</p>
						<button
							type="submit"
							disabled={isSubmitDisabled || form.formState.isSubmitting}
							className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-slate-950 px-5 py-3 text-[14px] font-bold tracking-[0.12em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
						>
							<PencilLine className="h-4 w-4" />
							投稿
						</button>
					</div>
				</form>
			</Form>
		</section>
	);
}
