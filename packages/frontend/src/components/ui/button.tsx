import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { buttonColor } from "@/lib/config/color/buttonColor";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground",
				destructive:
					"bg-destructive text-white shadow-xs [@media(hover:hover)]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background [@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:[@media(hover:hover)]:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground [@media(hover:hover)]:hover:bg-secondary/80",
				ghost:
					"[@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:hover:text-accent-foreground dark:[@media(hover:hover)]:hover:bg-accent/50",
				link: "text-primary underline-offset-4 [@media(hover:hover)]:hover:underline",
				google:
					"bg-white text-slate-700 border border-slate-300 [@media(hover:hover)]:hover:bg-surface-100 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:[@media(hover:hover)]:hover:bg-slate-800",
				tag: "bg-blue-200/20 [@media(hover:hover)]:hover:bg-blue-300/40 ring-1 ring-blue-300/60 text-blue-500 text-xs transition-colors duration-150",
				"zenn-like":
					"font-semibold text-white bg-[#3ea6ff] [@media(hover:hover)]:hover:bg-[#1d9bf0]",

				...buttonColor,
			},
			size: {
				default: "h-9 px-4 py-4 has-[>svg]:px-3",
				sm: "h-7 gap-1.5 px-1 has-[>svg]:px-2.5",
				lg: "h-10 px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
			enableClickAnimation: {
				true: "transition-transform active:scale-95 duration-50",
				false: "",
			},
			hover: {
				none: "",
				brightness: "[@media(hover:hover)]:hover:brightness-110",
			},
			rounded: {
				sm: "rounded-sm",
				md: "rounded-md",
				lg: "rounded-lg",
				xl: "rounded-xl",
				full: "rounded-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	hover = "none",
	asChild = false,
	enableClickAnimation = false,
	rounded,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(
				buttonVariants({
					variant,
					size,
					hover,
					enableClickAnimation,
					rounded,
					className,
				}),
			)}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
