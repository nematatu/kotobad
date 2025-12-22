"use client";

import type * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ToastType = "default" | "success" | "info" | "warning" | "error";

type ToastButtonProps = {
	toastTitle: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	promise?: {
		promise: () => Promise<unknown>;
		loading: string;
		success: string | ((data: unknown) => string);
		error: string | ((error: unknown) => string);
	};
	types?: ToastType;
	children: React.ReactNode;
	onClick?: React.ComponentProps<typeof Button>["onClick"];
} & Omit<React.ComponentProps<typeof Button>, "onClick">;

export default function ToastButton({
	toastTitle,
	description,
	action,
	promise,
	types = "default",
	onClick,
	children,
	variant = "outline",
	...buttonProps
}: ToastButtonProps) {
	const showToast = () => {
		if (promise) {
			toast.promise(promise.promise(), {
				loading: promise.loading,
				success: promise.success,
				error: promise.error,
			});
			return;
		}

		switch (types) {
			case "success":
				toast.success(toastTitle, { description, action });
				return;
			case "info":
				toast.info(toastTitle, { description, action });
				return;
			case "warning":
				toast.warning(toastTitle, { description, action });
				return;
			case "error":
				toast.error(toastTitle, { description, action });
				return;
			default:
				toast(toastTitle, { description, action });
		}
	};

	return (
		<Button
			variant={variant}
			{...buttonProps}
			onClick={(event) => {
				onClick?.(event);
				showToast();
			}}
		>
			{children}
		</Button>
	);
}
