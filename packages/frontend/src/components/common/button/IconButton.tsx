import type * as React from "react";

import { Button } from "@/components/ui/button";

type IconButtonProps = React.ComponentProps<typeof Button> & {
	icon: React.ReactNode;
};

function IconButton({
	icon,
	className,
	children,
	ref,
	...props
}: IconButtonProps) {
	return (
		<Button ref={ref} className={className} {...props}>
			{icon}
			{children}
		</Button>
	);
}

export default IconButton;
