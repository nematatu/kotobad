import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

const joinClassNames = (...values: Array<string | undefined>) =>
	values
		.filter((value) => typeof value === "string" && value.length > 0)
		.join(" ");

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;

export const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={joinClassNames("player-editor-dialog-overlay", className)}
		{...props}
	/>
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay />
		<div className="player-editor-dialog-content">
			<DialogPrimitive.Content ref={ref} className={className} {...props}>
				{children}
			</DialogPrimitive.Content>
		</div>
	</DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;
