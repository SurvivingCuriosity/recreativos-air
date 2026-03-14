import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type MouseEvent } from "react";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "neutral"
  | "outline-neutral";

export interface ButtonProps {
  as?: "button" | "a";
  onClick?: () => void;
  children?: React.ReactNode;
  href?: string;
  icon?: IconDefinition;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
}

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
  } = props;

  const Component = href ? (as === "a" ? "a" : "button") : as;

  const esSoloIcon = children === undefined && icon !== undefined;

  const handleClick = (e: MouseEvent) => {
    if (type !== "submit") {
      e.preventDefault();
    }
    e.stopPropagation();
    if(onClick) onClick();
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-radial from-primary2 to-primary text-neutral-900",
    outline: "bg-neutral-900/80 text-primary border border-primary",
    neutral: "text-neutral-900/80 bg-neutral-400 border border-neutral-400",
    "outline-neutral":
      "bg-neutral-900/80 text-neutral-400 border border-neutral-400",
  };

  return (
    <Component
      onClick={handleClick}
      href={href}
      disabled={disabled}
      type={type}
      className={`${esSoloIcon ? 'p-2 rounded-full aspect-square' : 'px-3 py-1'} w-full h-10 flex items-center justify-center font-bold rounded-2xl gap-2 outline-none focus:outline-none ${variantStyles[variant]} disabled:bg-neutral-700! disabled:[background-image:none]! disabled:text-neutral-600!`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
      {children}
    </Component>
  );
};
