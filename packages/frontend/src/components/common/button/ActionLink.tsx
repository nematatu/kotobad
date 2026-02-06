import { Link } from "@/components/common/Link";
import { cn } from "@/lib/utils";

export type ActionLinkItem = {
	label: React.ReactNode;
	href: string;
	badge?: React.ReactNode;
	icon?: React.ComponentType<{ className?: string }>;
	tone?: "default" | "accent";
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
		"inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-gray-100 md:text-sm",
	menu: "inline-flex self-start items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",
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

	return (
		<Link
			href={item.href}
			{...linkProps}
			showIndicator={variant !== "menu"}
			className={cn(
				variantClasses[variant],
				toneClasses[item.tone ?? "default"],
				className,
			)}
		>
			{Icon ? <Icon className="h-4 w-4" /> : null}
			<span>{item.label}</span>
			{item.badge ?? null}
		</Link>
	);
};

export default ActionLink;
