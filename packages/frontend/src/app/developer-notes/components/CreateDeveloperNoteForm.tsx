"use client";

import type { CreateDeveloperNoteType } from "@kotobad/shared/src/types/developerNote";
import type {
	CreateDeveloperRoadmapItemType,
	DeveloperRoadmapStatusType,
} from "@kotobad/shared/src/types/developerRoadmap";
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
import { Textarea } from "@/components/ui/textarea";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { getBffApiUrl } from "@/lib/api/url/bffApiUrls";
import { cn } from "@/lib/utils";

type FormMode = "note" | "roadmap";
type DeveloperNoteFormValues = {
	content: string;
	status: DeveloperRoadmapStatusType;
};

const FORM_MODE_META: Record<
	FormMode,
	{
		label: string;
		selectedClass: string;
		idleClass: string;
		placeholder: string;
		successMessage: string;
	}
> = {
	note: {
		label: "ボヤキ",
		selectedClass: "",
		idleClass: "",
		placeholder: "ボヤき...",
		successMessage: "ボヤキを投稿しました",
	},
	roadmap: {
		label: "ロードマップ",
		selectedClass:
			"border-sky-300 bg-sky-100 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.18)] dark:border-sky-400/40 dark:bg-sky-500/20 dark:text-sky-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-sky-200 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-sky-400/30 dark:hover:text-sky-200",
		placeholder: "ロードマップに追加する項目...",
		successMessage: "ロードマップに追加しました",
	},
};

const ROADMAP_STATUS_META: Record<
	DeveloperRoadmapStatusType,
	{
		label: string;
		selectedClass: string;
		idleClass: string;
	}
> = {
	wip: {
		label: "WIP",
		selectedClass:
			"border-sky-300 bg-sky-100 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.18)] dark:border-sky-400/40 dark:bg-sky-500/20 dark:text-sky-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-sky-200 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-sky-400/30 dark:hover:text-sky-200",
	},
	todo: {
		label: "Todo",
		selectedClass:
			"border-emerald-300 bg-emerald-100 text-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.18)] dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-400/30 dark:hover:text-emerald-200",
	},
	done: {
		label: "Done",
		selectedClass:
			"border-amber-300 bg-amber-100 text-amber-700 shadow-[0_8px_20px_rgba(245,158,11,0.18)] dark:border-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-amber-200 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-amber-400/30 dark:hover:text-amber-200",
	},
};

const ROADMAP_STATUS_ORDER: DeveloperRoadmapStatusType[] = [
	"wip",
	"todo",
	"done",
];

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
	const [mode, setMode] = useState<FormMode>("note");
	const form = useForm<DeveloperNoteFormValues>({
		defaultValues: {
			content: "",
			status: "wip",
		},
	});

	const contentValue = form.watch("content");
	const statusValue = form.watch("status");
	const isRoadmapMode = mode === "roadmap";
	const isSubmitDisabled = !contentValue?.trim();

	const handleSubmit = async (values: DeveloperNoteFormValues) => {
		setSubmitError(null);

		try {
			if (isRoadmapMode) {
				const endpoint = await getBffApiUrl("CREATE_DEVELOPER_ROADMAP");
				const payload: CreateDeveloperRoadmapItemType = {
					title: values.content,
					status: values.status,
				};

				await BffFetcher(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			} else {
				const endpoint = await getBffApiUrl("CREATE_DEVELOPER_NOTE");
				const payload: CreateDeveloperNoteType = {
					content: values.content,
				};

				await BffFetcher(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
			}

			form.reset({
				content: "",
				status: values.status,
			});
			toast.success(FORM_MODE_META[mode].successMessage);
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
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="mt-5 space-y-5"
				>
					<FormItem>
						<div className="flex flex-wrap gap-2">
							{(Object.keys(FORM_MODE_META) as FormMode[]).map((entryMode) => {
								const meta = FORM_MODE_META[entryMode];

								return (
									<button
										key={entryMode}
										type="button"
										onClick={() => setMode(entryMode)}
										className={cn(
											"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold tracking-[0.12em] transition-colors",
											mode === entryMode ? meta.selectedClass : meta.idleClass,
										)}
									>
										<span>{meta.label}</span>
									</button>
								);
							})}
						</div>
					</FormItem>

					{isRoadmapMode ? (
						<FormField
							control={form.control}
							name="status"
							render={() => (
								<FormItem>
									<div className="flex flex-wrap gap-2">
										{ROADMAP_STATUS_ORDER.map((status) => {
											const meta = ROADMAP_STATUS_META[status];

											return (
												<button
													key={status}
													type="button"
													onClick={() =>
														form.setValue("status", status, {
															shouldDirty: true,
															shouldValidate: true,
														})
													}
													className={cn(
														"inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold tracking-[0.12em] transition-colors",
														statusValue === status
															? meta.selectedClass
															: meta.idleClass,
													)}
												>
													<span>{meta.label}</span>
												</button>
											);
										})}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					) : null}

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
											placeholder={FORM_MODE_META[mode].placeholder}
											className="resize-none rounded-[24px] border-slate-200 bg-white/70 px-5 py-4 text-[15px] leading-8 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-50"
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
						<IconButton
							type="submit"
							disabled={isSubmitDisabled}
							hover="brightness"
							icon={<PencilLine />}
							variant="logo1"
							size="lg"
							rounded="full"
							enableClickAnimation
						>
							<span className="text-md">投稿する</span>
						</IconButton>
					</div>
				</form>
			</Form>
		</section>
	);
}
