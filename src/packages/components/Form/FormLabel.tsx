import React from "react";
import { Label } from "@/components/ui/label";

export const FormLabel = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => {
  return (
    <Label htmlFor={htmlFor} className="text-[13px] font-semibold text-foreground-soft">
      {children}
    </Label>
  );
};
