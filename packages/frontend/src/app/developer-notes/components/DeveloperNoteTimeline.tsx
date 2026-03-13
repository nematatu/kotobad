"use client";

import type {
	DeveloperNoteLabelType,
	DeveloperNoteType,
} from "@kotobad/shared/src/types/developerNote";
import { X } from "lucide-react";
import { Yuji_Syuku } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthorAvatar from "@/components/feature/user/AuthorAvatar";
import {
	BffFetcher,
	type BffFetcherError,
} from "@/lib/api/fetcher/bffFetcher.client";
import { cn } from "@/lib/utils";

type Props = {
	notes: DeveloperNoteType[];
	labels: DeveloperNoteLabelType[];
	canEdit: boolean;
};

const kabukiLabelFont = Yuji_Syuku({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

const NOTE_LABEL_SEAL_CLASS =
	"relative inline-flex min-h-[82px] min-w-[35px] items-center justify-center overflow-hidden border-[2px] border-black bg-[#d40000] px-1 py-1.5 text-center text-[18px] font-black leading-none text-white [text-orientation:upright] [writing-mode:vertical-rl] before:pointer-events-none before:absolute before:inset-[2px] before:border before:border-white before:content-[''] after:pointer-events-none after:absolute after:inset-x-[2px] after:top-[2px] after:h-[34%] after:content-['']";

const NOTE_LABEL_SKELETON_CLASS =
	"relative inline-flex min-h-[68px] min-w-[29px] items-center justify-center rounded-[1px] border-2 border-dashed border-slate-300/80 bg-white/24 text-slate-400 shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_8px_16px_rgba(15,23,42,0.04)] backdrop-blur-[0.5px] dark:border-slate-500/70 dark:bg-white/8 dark:text-slate-500 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_16px_rgba(2,6,23,0.18)]";

const NOTE_LABEL_SEAL_TEXT_STYLE = {
	fontFeatureSettings: '"palt" 1',
	letterSpacing: "-0.04em",
} as const;

const formatDottedDate = (value: string) => {
	const formatter = new Intl.DateTimeFormat("ja-JP", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return formatter.format(date).replaceAll("/", ".");
};

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

export function DeveloperNoteTimeline({
	notes: initialNotes,
	labels,
	canEdit,
}: Props) {
	const router = useRouter();
	const [notes, setNotes] = useState(initialNotes);
	const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
	const [pendingNoteId, setPendingNoteId] = useState<number | null>(null);

	useEffect(() => {
		setNotes(initialNotes);
	}, [initialNotes]);

	const handleLabelChange = async (noteId: number, labelId: number | null) => {
		if (!canEdit || pendingNoteId !== null) {
			return;
		}

		setPendingNoteId(noteId);

		try {
			const updatedNote = await BffFetcher<DeveloperNoteType>(
				`/developer-notes/api/updateNoteLabel/${noteId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ labelId }),
				},
			);

			setNotes((previousNotes) =>
				previousNotes.map((note) =>
					note.id === updatedNote.id ? updatedNote : note,
				),
			);
			setExpandedNoteId(null);
			router.refresh();
		} catch (error: unknown) {
			toast.error(getErrorMessage(error));
		} finally {
			setPendingNoteId(null);
		}
	};

	const renderNoteLabelSeal = (labelName: string, className?: string) => (
		<span className={cn("inline-flex", className)}>
			<span
				className={cn(kabukiLabelFont.className, NOTE_LABEL_SEAL_CLASS)}
				style={NOTE_LABEL_SEAL_TEXT_STYLE}
			>
				{labelName}
			</span>
		</span>
	);

	const renderNoteLabelSkeleton = (className?: string) => (
		<span className={cn(NOTE_LABEL_SKELETON_CLASS, className)}>
			<X className="h-3.5 w-3.5" strokeWidth={1.8} />
		</span>
	);

	return (
		<div className="space-y-10 sm:space-y-12">
			{notes.length === 0 ? (
				<section className="rounded-[28px] border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
					<p className="text-[12px] font-black tracking-[0.28em] text-slate-400 dark:text-slate-500">
						EMPTY
					</p>
					<p className="mt-3 text-[15px] leading-8 text-slate-500 dark:text-slate-300">
						まだボヤキはありません。
					</p>
				</section>
			) : null}

			{notes.map((note) => {
				const isExpanded = expandedNoteId === note.id;
				const isPending = pendingNoteId === note.id;

				return (
					<article key={note.id} className="flex items-start gap-3 sm:gap-4">
						<div className="pt-1">
							<AuthorAvatar
								name={note.author.name}
								image={note.author.image}
								className="h-11 w-11 border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
								fallbackClassName="bg-sky-500 text-sm font-black text-white"
							/>
						</div>

						<div className="min-w-0 flex-1">
							<div className="pb-8">
								<div className="relative max-w-[44rem] rounded-[24px] bg-white px-5 py-4 sm:px-6 sm:py-5 dark:bg-slate-900">
									<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
										<p className="text-[13px] font-bold tracking-[0.06em] text-slate-700 dark:text-slate-200">
											{note.author.name}
										</p>
										<time className="text-[12px] font-medium tracking-[0.08em] text-slate-400 dark:text-slate-500">
											{formatDottedDate(note.createdAt)}
										</time>
									</div>
									<p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-700 dark:text-slate-200">
										{note.content}
									</p>

									{note.label ? (
										canEdit ? (
											<button
												type="button"
												onClick={() =>
													setExpandedNoteId((previousId) =>
														previousId === note.id ? null : note.id,
													)
												}
												disabled={isPending}
												className="absolute -bottom-6 -right-2 opacity-68 cursor-pointer disabled:cursor-default"
											>
												{renderNoteLabelSeal(note.label.name, "rotate-[6deg]")}
											</button>
										) : (
											<div className="absolute -bottom-6 right-2">
												{renderNoteLabelSeal(note.label.name, "rotate-[6deg]")}
											</div>
										)
									) : canEdit ? (
										<button
											type="button"
											onClick={() =>
												setExpandedNoteId((previousId) =>
													previousId === note.id ? null : note.id,
												)
											}
											disabled={isPending}
											className="absolute -bottom-6 right-2 cursor-pointer disabled:cursor-default"
										>
											{renderNoteLabelSkeleton("rotate-[6deg]")}
										</button>
									) : null}
								</div>
							</div>

							{canEdit && isExpanded ? (
								<div className="flex flex-wrap items-end gap-3 pl-2">
									<button
										type="button"
										onClick={() => handleLabelChange(note.id, null)}
										disabled={isPending || note.label === null}
										className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-default disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
									>
										ラベルなし
									</button>
									{labels.map((label) => {
										const isSelected = note.label?.id === label.id;

										return (
											<button
												key={label.id}
												type="button"
												onClick={() => handleLabelChange(note.id, label.id)}
												disabled={isPending || isSelected}
												className="cursor-pointer rounded-full transition-opacity disabled:cursor-default disabled:opacity-60"
											>
												{renderNoteLabelSeal(
													label.name,
													cn(
														"min-h-[72px] min-w-[33px] rotate-[6deg] text-[11px]",
														!isSelected && "opacity-75",
													),
												)}
											</button>
										);
									})}
								</div>
							) : null}
						</div>
					</article>
				);
			})}
		</div>
	);
}
