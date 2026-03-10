import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
				outline: "text-foreground",
				dot: "gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-none",
			},
			color: {
				default: "",
				slate: "",
				violet: "",
				emerald: "",
				amber: "",
			},
		},
		compoundVariants: [
			{
				variant: "dot",
				color: "slate",
				className:
					"border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
			},
			{
				variant: "dot",
				color: "violet",
				className:
					"border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-200",
			},
			{
				variant: "dot",
				color: "emerald",
				className:
					"border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200",
			},
			{
				variant: "dot",
				color: "amber",
				className:
					"border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200",
			},
		],
		defaultVariants: {
			variant: "default",
			color: "default",
		},
	},
);

const dotVariants = cva("h-1.5 w-1.5 rounded-full", {
	variants: {
		color: {
			default: "bg-current",
			slate: "bg-slate-500 dark:bg-slate-300",
			violet: "bg-violet-500 dark:bg-violet-300",
			emerald: "bg-emerald-500 dark:bg-emerald-300",
			amber: "bg-amber-500 dark:bg-amber-300",
		},
	},
	defaultVariants: {
		color: "default",
	},
});

export interface BadgeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
		VariantProps<typeof badgeVariants> {}

function Badge({
	className,
	variant,
	color,
	children,
	...props
}: React.PropsWithChildren<BadgeProps>) {
	return (
		<div
			className={cn(badgeVariants({ variant, color }), className)}
			{...props}
		>
			{variant === "dot" ? (
				<span aria-hidden="true" className={dotVariants({ color })} />
			) : null}
			{children}
		</div>
	);
}

export { Badge, badgeVariants };
