import type * as React from "react";

import { Button } from "@/components/ui/button";

type IconButtonProps = React.ComponentProps<"button"> & {
	icon: React.ReactNode;
};

function IconButton({ icon, className, children, ...props }: IconButtonProps) {
	return (
		<div className={className}>
			<Button variant={"outline"} {...props}>
				{icon}
				{children}
			</Button>
		</div>
	);
}

export default IconButton;
