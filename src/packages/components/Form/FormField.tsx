import React from "react";
import { cn } from "@/lib/utils";

export const FormField = ({
  children,
  row = false,
  border = false,
}: {
  children: React.ReactNode;
  row?: boolean;
  border?: boolean;
}) => {
  return (
    <div
      className={cn(
        row ? "flex flex-row items-center gap-2" : "flex flex-col gap-1.5",
        border ? "border-b border-border pb-3" : "mb-3"
      )}
    >
      {children}
    </div>
  );
};
