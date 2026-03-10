import type {
	DeveloperNoteKindType,
	DeveloperNoteStatusType,
} from "@kotobad/shared/src/types/developerNote";

export const DEVELOPER_NOTE_STATUS_ORDER: DeveloperNoteStatusType[] = [
	"wip",
	"todo",
	"done",
];

export const DEVELOPER_NOTE_KIND_ORDER: DeveloperNoteKindType[] = [
	"log",
	"note",
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

export const DEVELOPER_NOTE_KIND_META: Record<
	DeveloperNoteKindType,
	{
		label: string;
		description: string;
		badgeClass: string;
		selectedClass: string;
		idleClass: string;
	}
> = {
	log: {
		label: "LOG",
		description: "進捗や作業メモ",
		badgeClass:
			"border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
		selectedClass:
			"border-slate-300 bg-slate-100 text-slate-700 shadow-[0_8px_20px_rgba(148,163,184,0.16)] dark:border-slate-500/50 dark:bg-slate-800 dark:text-slate-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-500/50 dark:hover:text-slate-100",
	},
	note: {
		label: "NOTE",
		description: "個人的な雑感や気づき",
		badgeClass:
			"border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-400/30 dark:bg-fuchsia-500/15 dark:text-fuchsia-200",
		selectedClass:
			"border-fuchsia-300 bg-fuchsia-100 text-fuchsia-700 shadow-[0_8px_20px_rgba(192,38,211,0.16)] dark:border-fuchsia-400/40 dark:bg-fuchsia-500/20 dark:text-fuchsia-100",
		idleClass:
			"border-slate-200 bg-white/80 text-slate-500 hover:border-fuchsia-200 hover:text-fuchsia-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-fuchsia-400/30 dark:hover:text-fuchsia-200",
	},
};
