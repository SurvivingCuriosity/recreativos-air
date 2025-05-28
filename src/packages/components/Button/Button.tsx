import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type MouseEvent } from "react";

export type ButtonVariant = "primary" | "outline" | "neutral" | "outline-neutral";

export interface ButtonProps {
  as?: "button" | "a";
  onClick: () => void;
  children: React.ReactNode;
  href?: string;
  icon?: IconDefinition;
  variant?: ButtonVariant
}

export const Button = (props: ButtonProps) => {
  const { as = "button", onClick, children, href, icon, variant = "primary" } = props;

  const Component = href ? (as === "a" ? "a" : "button") : as;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-black",
    outline: "bg-transparent text-primary border border-primary",
    neutral: "bg-neutral-700 text-neutral-100",
    "outline-neutral": "bg-transparent text-neutral-700 border border-neutral-700",
  };

  return (
    <Component
      onClick={handleClick}
      href={href}
      className={`w-full h-9 flex items-center justify-center font-bold px-3 py-1 rounded-lg gap-2 ${variantStyles[variant]}`}
    >
      {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
      {children}
    </Component>
  );
};
