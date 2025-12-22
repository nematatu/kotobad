import type * as React from "react";

import { Button } from "@/components/ui/button";

type IconButtonProps = React.ComponentProps<typeof Button> & {
	icon: React.ReactNode;
};

function IconButton({ icon, className, children, ...props }: IconButtonProps) {
	return (
		<div className={className}>
			<Button {...props}>
				{icon}
				<span>{children}</span>
			</Button>
		</div>
	);
}

export default IconButton;
