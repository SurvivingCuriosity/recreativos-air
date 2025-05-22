import type React from "react";

type TituloVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const Titulo = ({
  className,
  variant,
  children,
}: {
  className?: string;
  variant: TituloVariant;
  children: React.ReactNode;
}) => {
  const Component = variant;

  const classNameMap: Record<TituloVariant, string> = {
    h1: "text-4xl font-extrabold text-primary",
    h2: "text-3xl font-bold text-primary",
    h3: "text-2xl font-bold text-primary",
    h4: "text-xl font-bold text-primary",
    h5: "text-lg font-bold text-primary",
    h6: "text-base font-bold text-primary",
  };

  return <Component className={`${classNameMap[variant]} ${className}`}>{children}</Component>;
};
