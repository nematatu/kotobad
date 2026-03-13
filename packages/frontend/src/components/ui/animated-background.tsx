"use client";

import { motion, type Transition } from "motion/react";
import {
	Children,
	cloneElement,
	type HTMLAttributes,
	type ReactElement,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react";
import { cn } from "@/lib/utils";

type AnimatedBackgroundChildProps = HTMLAttributes<HTMLElement> & {
	"data-id": string;
	"data-checked"?: "true" | "false";
	children?: ReactNode;
};

export type AnimatedBackgroundProps = {
	children:
		| ReactElement<AnimatedBackgroundChildProps>[]
		| ReactElement<AnimatedBackgroundChildProps>;
	value?: string | null;
	defaultValue?: string;
	onValueChange?: (newActiveId: string | null) => void;
	className?: string;
	transition?: Transition;
	enableHover?: boolean;
};

export function AnimatedBackground({
	children,
	value,
	defaultValue,
	onValueChange,
	className,
	transition,
	enableHover = false,
}: AnimatedBackgroundProps) {
	const [uncontrolledActiveId, setUncontrolledActiveId] = useState<
		string | null
	>(defaultValue ?? null);
	const uniqueId = useId();
	const isControlled = value !== undefined;
	const activeId = isControlled ? value : uncontrolledActiveId;

	const handleSetActiveId = (id: string | null) => {
		if (!isControlled) {
			setUncontrolledActiveId(id);
		}
		onValueChange?.(id);
	};

	useEffect(() => {
		if (!isControlled && defaultValue !== undefined) {
			setUncontrolledActiveId(defaultValue);
		}
	}, [defaultValue, isControlled]);

	return Children.map(children, (child) => {
		const id = child.props["data-id"];

		const interactionProps = enableHover
			? {
					onMouseEnter: () => handleSetActiveId(id),
					onMouseLeave: () => handleSetActiveId(null),
				}
			: {
					onClick: () => handleSetActiveId(id),
				};

		return cloneElement(
			child,
			{
				key: id,
				className: cn("relative inline-flex", child.props.className),
				"data-checked": activeId === id ? "true" : "false",
				...interactionProps,
			},
			<>
				{activeId === id ? (
					<motion.div
						layoutId={`background-${uniqueId}`}
						className={cn("absolute inset-0", className)}
						transition={transition}
					/>
				) : null}
				<div className="z-10">{child.props.children}</div>
			</>,
		);
	});
}
