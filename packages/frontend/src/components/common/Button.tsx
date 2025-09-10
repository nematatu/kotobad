"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ここで自分用のデフォルト props や variant を設定
export interface CustomButtonProps extends Omit<ShadcnButtonProps, "size" | "variant"> {
  variant?: "default" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : ShadcnButton;
    
    if (asChild) {
      return (
        <Comp
          className={cn(
            "inline-flex items-center justify-center gap-2 transition-colors",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    // shadcn/ui Button にラップしてデフォルト値を適用
    return (
      <ShadcnButton
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
