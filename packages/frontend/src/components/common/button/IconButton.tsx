import type * as React from "react";

import { Button } from "@/components/ui/button";

type IconButtonProps = React.ComponentProps<typeof Button> & {
	icon: React.ReactNode;
	iconPosition?: "left" | "right";
};

function IconButton({
	icon,
	className,
	children,
	ref,
	iconPosition = "left",
	...props
}: IconButtonProps) {
	return (
		<Button ref={ref} className={className} {...props}>
			{iconPosition === "left" && icon}
			{children}
			{iconPosition === "right" && icon}
		</Button>
	);
}

export default IconButton;
