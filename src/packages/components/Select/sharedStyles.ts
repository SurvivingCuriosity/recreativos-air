import type { CSSObjectWithLabel } from "react-select";

// sharedStyles.ts
export const sharedSelectStyles = {
  container: (provided: CSSObjectWithLabel) => ({
    ...provided,
    width: "100%",
    height: "100%",
  }),
  control: (
    provided: CSSObjectWithLabel,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    backgroundColor: isDisabled
      ? "var(--color-neutral-700)"
      : "var(--color-neutral-800)",
    border: "1px solid transparent",
    boxShadow: "none",
    borderRadius: "0.375rem",
    height: "36px",
    minHeight: "36px",
    "&:focus-within": {
      border: "1px solid var(--color-primary)",
      boxShadow: "none",
      outline: "none",
    },
    "&:hover": {
      border: "1px solid transparent",
      boxShadow: "none",
      outline: "none",
    },
  }),

  input: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "var(--color-neutral-300)",
    "&:focus": {
      boxShadow: "none",
    },
  }),
  singleValue: (
    provided: CSSObjectWithLabel,
    { isDisabled }: { isDisabled: boolean }
  ) => ({
    ...provided,
    color: isDisabled ? "var(--color-neutral-500)" : "var(--color-neutral-200)",
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    padding: "0.25em",
    color: "var(--color-primary)",
    backgroundColor: "var(--color-neutral-950)",
    border: "1px solid var(--color-neutral-700)",
    boxShadow: "none",
  }),
  option: (
    provided: CSSObjectWithLabel,
    { isSelected }: { isSelected: boolean }
  ) => ({
    ...provided,
    borderRadius: "5px",
    backgroundColor: isSelected
      ? "var(--color-neutral-900)"
      : "var(--color-neutral-950)",
    color: "var(--color-neutral-50)",
    "&:hover": {
      backgroundColor: "var(--color-neutral-800)",
      color: "var(--color-primary)",
    },
  }),
};
