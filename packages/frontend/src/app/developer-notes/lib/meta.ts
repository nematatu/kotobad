import type { DeveloperNoteStatusType } from "@kotobad/shared/src/types/developerNote";

export const DEVELOPER_NOTE_STATUS_ORDER: DeveloperNoteStatusType[] = [
	"wip",
	"todo",
	"done",
];

export const DEVELOPER_NOTE_STATUS_META: Record<
	DeveloperNoteStatusType,
	{
		label: string;
		description: string;
		badgeClass: string;
		selectedClass: string;
		idleClass: string;
	}
> = {
	wip: {
		label: "WIP",
		description: "今進めている作業",
		badgeClass: "bg-sky-500 text-white dark:bg-sky-400 dark:text-slate-950",
		selectedClass:
			"border-sky-300 bg-sky-100 text-sky-700 shadow-[0_8px_20px_rgba(14,165,233,0.18)] dark:border-sky-400/40 dark:bg-sky-500/20 dark:text-sky-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-sky-200 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-sky-400/30 dark:hover:text-sky-200",
	},
	todo: {
		label: "TODO",
		description: "これから着手すること",
		badgeClass:
			"bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950",
		selectedClass:
			"border-emerald-300 bg-emerald-100 text-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.18)] dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-400/30 dark:hover:text-emerald-200",
	},
	done: {
		label: "DONE",
		description: "終わった作業のメモ",
		badgeClass: "bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950",
		selectedClass:
			"border-amber-300 bg-amber-100 text-amber-700 shadow-[0_8px_20px_rgba(245,158,11,0.18)] dark:border-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-amber-200 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-amber-400/30 dark:hover:text-amber-200",
	},
};
