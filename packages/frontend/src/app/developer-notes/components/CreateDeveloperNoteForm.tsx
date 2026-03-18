"use client";

import type { CreateDeveloperNoteType } from "@kotobad/shared/src/types/developerNote";
import type {
	CreateDeveloperRoadmapItemType,
	DeveloperRoadmapStatusType,
} from "@kotobad/shared/src/types/developerRoadmap";
import { CheckCheck, Clock3, ListTodo, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import IconButton from "@/components/common/button/IconButton";
import UserAvatar from "@/components/feature/user/UserAvatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Kbd } from "@/components/ui/kbd";
import {
	SubtleTab,
	SubtleTabItem,
	SubtleTabPanel,
} from "@/components/ui/subtle-tab";
import { Switch } from "@/components/ui/switch";
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
		placeholder: string;
		successMessage: string;
	}
> = {
	note: {
		label: "ボヤキ",
		placeholder: "ボヤき...",
		successMessage: "ボヤキを投稿しました",
	},
	roadmap: {
		label: "ロードマップ",
		placeholder: "ロードマップに追加する項目...",
		successMessage: "ロードマップに追加しました",
	},
};

const ROADMAP_STATUS_META: Record<
	DeveloperRoadmapStatusType,
	{
		label: string;
		description: string;
		icon: typeof Clock3;
	}
> = {
	wip: {
		label: "WIP",
		description: "いま進めている項目",
		icon: Clock3,
	},
	todo: {
		label: "Todo",
		description: "次に着手したい項目",
		icon: ListTodo,
	},
	done: {
		label: "Done",
		description: "完了済みの項目",
		icon: CheckCheck,
	},
};

const ROADMAP_STATUS_ORDER: DeveloperRoadmapStatusType[] = [
	"wip",
	"todo",
	"done",
];

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
	const selectedStatusIndex = Math.max(
		ROADMAP_STATUS_ORDER.indexOf(statusValue),
		0,
	);

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
		}
	};

	return (
		<section
			aria-labelledby="create-developer-note-title"
			className="rounded-[28px] border border-slate-200/80 bg-white/88 px-5 py-5 md:px-6 md:py-6 dark:border-slate-800 dark:bg-slate-900/72"
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="mt-5 space-y-5"
				>
					<FormItem>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setMode("note")}
								className={cn(
									"text-[13px] font-bold tracking-[0.12em] transition-colors",
									mode === "note"
										? "text-slate-950 dark:text-slate-50"
										: "text-slate-400 dark:text-slate-500",
								)}
							>
								{FORM_MODE_META.note.label}
							</button>
							<Switch
								checked={isRoadmapMode}
								onCheckedChange={(checked) =>
									setMode(checked ? "roadmap" : "note")
								}
								aria-label="投稿種別の切り替え"
							/>
							<button
								type="button"
								onClick={() => setMode("roadmap")}
								className={cn(
									"text-[13px] font-bold tracking-[0.12em] transition-colors",
									mode === "roadmap"
										? "text-slate-950 dark:text-slate-50"
										: "text-slate-400 dark:text-slate-500",
								)}
							>
								{FORM_MODE_META.roadmap.label}
							</button>
						</div>
					</FormItem>

					{isRoadmapMode ? (
						<FormField
							control={form.control}
							name="status"
							render={() => (
								<FormItem>
									<SubtleTab
										idPrefix="developer-roadmap-status"
										selectedIndex={selectedStatusIndex}
										onSelect={(index) =>
											form.setValue(
												"status",
												ROADMAP_STATUS_ORDER[index] ?? "wip",
												{
													shouldDirty: true,
													shouldValidate: true,
												},
											)
										}
										className="w-fit rounded-full border border-slate-200 bg-white/80 px-1.5 py-1 dark:border-slate-700 dark:bg-slate-900/70"
									>
										{ROADMAP_STATUS_ORDER.map((status, index) => {
											const meta = ROADMAP_STATUS_META[status];

											return (
												<SubtleTabItem
													key={status}
													index={index}
													icon={meta.icon}
													label={meta.label}
												/>
											);
										})}
									</SubtleTab>
									{ROADMAP_STATUS_ORDER.map((status, index) => {
										const meta = ROADMAP_STATUS_META[status];

										return (
											<SubtleTabPanel
												key={status}
												index={index}
												selectedIndex={selectedStatusIndex}
												idPrefix="developer-roadmap-status"
												className="mt-3 px-2 text-[13px] leading-6 text-slate-500 dark:text-slate-300"
											>
												<p>{meta.description}</p>
											</SubtleTabPanel>
										);
									})}
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
												required: "",
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
											className="resize-none rounded-[24px] border-slate-200 bg-white/70 px-5 py-4 text-base leading-8 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-50 sm:text-[15px]"
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

					<div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end dark:border-slate-800">
						<Button
							type="submit"
							disabled={isSubmitDisabled}
							hover="brightness"
							variant="logo1"
							size="lg"
							rounded="full"
							enableClickAnimation
						>
							<span className="text-md">投稿する</span>
							<div className="hidden sm:block">
								<Kbd>⌘ + Enter</Kbd>
							</div>
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
}
