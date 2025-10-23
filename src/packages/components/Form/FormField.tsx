import React from "react";

export const FormField = ({
  children,
  row = false,
  border = false,
}: {
  children: React.ReactNode;
  row?: boolean;
  border?: boolean;
}) => {
  if (row) {
    return (
      <div
        className={`space-x-2 flex flex-row items-center ${
          border ? "pb-2 border-b border-neutral-500" : "mb-2"
        }`}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`space-y-0.5 flex flex-col  ${
        border ? "pb-2 border-b border-neutral-500" : "mb-2"
      }`}
    >
      {children}
    </div>
  );
};
