import { Link } from "@/components/common/Link";
import type { ViewTransitionKey } from "@/config/viewTransition";
import { cn } from "@/lib/utils";

export type ActionLinkItem = {
	label: React.ReactNode;
	href: string;
	badge?: React.ReactNode;
	icon?: React.ComponentType<{ className?: string }>;
	iconPosition?: "left" | "right";
	tone?: "default" | "accent";
	mobileMenuPlacement?: "default" | "bottom";
	viewTransitionKey?: ViewTransitionKey;
};

type Variant = "header" | "menu";

type Props = {
	item: ActionLinkItem;
	variant?: Variant;
	className?: string;
} & Omit<
	React.ComponentPropsWithoutRef<typeof Link>,
	"href" | "children" | "className"
>;

const variantClasses: Record<Variant, string> = {
	header:
		"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:bg-gray-100 md:text-sm",
	menu: "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100",
};

const toneClasses = {
	default: "",
	accent: "text-slate-900",
};

const ActionLink = ({
	item,
	variant = "header",
	className,
	...linkProps
}: Props) => {
	const Icon = item.icon;
	const iconPosition = item.iconPosition ?? "left";

	return (
		<Link
			href={item.href}
			viewTransitionKey={item.viewTransitionKey}
			{...linkProps}
			showIndicator={variant !== "menu"}
			className={cn(
				variantClasses[variant],
				toneClasses[item.tone ?? "default"],
				className,
			)}
		>
			{Icon && iconPosition === "left" ? <Icon className="h-4 w-4" /> : null}
			<span>{item.label}</span>
			{Icon && iconPosition === "right" ? <Icon className="h-4 w-4" /> : null}
			{item.badge ?? null}
		</Link>
	);
};

export default ActionLink;
