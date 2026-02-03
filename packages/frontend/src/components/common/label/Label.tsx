import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

type LabelTone = {
	bg?: string;
	text?: string;
	border?: string;
};

const labelTones = {
	neutral: { bg: "#e2e8f0", text: "#334155", border: "#cbd5e1" },
	info: { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
	success: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
	warning: { bg: "#92400e", text: "#ede9fe", border: "#fde68a" },
	danger: { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
	new: { bg: "#ede9fe", text: "#5b21b6", border: "#ddd6fe" },
	brand: { bg: "#e0f2fe", text: "#0c4a6e", border: "#bae6fd" },
} as const satisfies Record<string, LabelTone>;

const labelVariants = cva(
	"inline-flex items-center gap-1 rounded-full border font-medium leading-none transition",
	{
		variants: {
			variant: {
				solid:
					"border-transparent bg-[var(--label-bg)] text-[var(--label-text)]",
				soft: "border-transparent bg-[var(--label-bg)] text-[var(--label-text)]",
				outline:
					"bg-transparent border-[var(--label-border)] text-[var(--label-text)]",
			},
			size: {
				xs: "px-1.5 py-0.5 text-[10px]",
				sm: "px-2 py-0.5 text-xs",
				md: "px-3 py-1 text-sm",
			},
			hover: {
				none: "",
				brightness: "hover:brightness-95",
			},
		},
		defaultVariants: {
			variant: "soft",
			size: "sm",
			hover: "brightness",
		},
	},
);

type LabelProps = React.ComponentProps<"span"> &
	VariantProps<typeof labelVariants> & {
		label?: string;
		leadingIcon?: React.ReactNode;
		tone?: keyof typeof labelTones;
	};

export default function Label({
	label,
	leadingIcon,
	className,
	variant,
	size,
	hover,
	tone = "neutral",
	children,
	...props
}: LabelProps) {
	const resolvedTone = labelTones[tone];
	const style = {
		"--label-bg": resolvedTone.bg,
		"--label-text": resolvedTone.text,
		"--label-border": resolvedTone.border,
	} as React.CSSProperties;

	return (
		<span
			style={style}
			className={cn(labelVariants({ variant, size, hover }), className)}
			{...props}
		>
			{leadingIcon}
			{children ?? label}
		</span>
	);
}
