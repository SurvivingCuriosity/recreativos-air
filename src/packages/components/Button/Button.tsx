import React, { type MouseEvent } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { Icon, type LucideIcon } from "@/shared/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Wrapper de compatibilidad sobre el Button de shadcn.
 * Mantiene la API previa (variantes antiguas, `icon`, `as`/`href`)
 * mientras las pantallas se migran fase a fase.
 */
export type ButtonVariant =
  | "primary"
  | "outline"
  | "neutral"
  | "outline-neutral"
  | "danger"
  | "outline-danger";

export interface ButtonProps {
  as?: "button" | "a";
  onClick?: () => void;
  children?: React.ReactNode;
  href?: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  className?: string;
  "aria-label"?: string;
}

const variantMap = {
  primary: "default",
  outline: "outline",
  neutral: "secondary",
  "outline-neutral": "secondary",
  danger: "destructive",
  "outline-danger": "destructive-outline",
} as const;

export const Button = (props: ButtonProps) => {
  const {
    as = "button",
    onClick,
    children,
    href,
    icon,
    variant = "primary",
    disabled = false,
    type = "button",
    className,
    ...rest
  } = props;

  const esSoloIcon = children === undefined && icon !== undefined;

  const handleClick = (e: MouseEvent) => {
    if (type !== "submit") {
      e.preventDefault();
    }
    e.stopPropagation();
    onClick?.();
  };

  const content = (
    <>
      {icon && <Icon icon={icon} size={18} />}
      {children}
    </>
  );

  if (href && as === "a") {
    return (
      <UIButton
        asChild
        variant={variantMap[variant]}
        size={esSoloIcon ? "icon" : "default"}
        className={cn(!esSoloIcon && "w-full", className)}
      >
        <a href={href} onClick={handleClick} aria-disabled={disabled} {...rest}>
          {content}
        </a>
      </UIButton>
    );
  }

  return (
    <UIButton
      type={type}
      onClick={handleClick}
      disabled={disabled}
      variant={variantMap[variant]}
      size={esSoloIcon ? "icon" : "default"}
      className={cn(!esSoloIcon && "w-full", className)}
      {...rest}
    >
      {content}
    </UIButton>
  );
};
