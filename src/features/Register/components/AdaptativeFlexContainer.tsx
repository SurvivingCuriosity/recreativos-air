import React, { useRef, useState } from "react";

export interface AdaptativeFlexContainerProps {
  children: React.ReactNode;
  focusedFlex?: number;
  unfocusedFlex?: number;
  gap?: string;
}

export const AdaptativeFlexContainer = ({
  children,
  focusedFlex = 2,
  unfocusedFlex = 1,
  gap = "gap-2",
}: AdaptativeFlexContainerProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleFocus = (index: number) => {
    clearTimeout(blurTimeoutRef.current);
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => setFocusedIndex(null), 0);
  };

  const slots = React.Children.toArray(children);

  return (
    <div className={`flex flex-row ${gap}`}>
      {slots.map((child, index) => {
        const flex =
          focusedIndex === null
            ? 1
            : focusedIndex === index
              ? focusedFlex
              : unfocusedFlex;

        return (
          <div
            key={index}
            style={{ flex, transition: "flex 200ms ease-out" }}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
