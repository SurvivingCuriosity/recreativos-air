"use client"

import React from "react";
import Select, { type CSSObjectWithLabel, type GroupBase } from "react-select";
import { type OptionType } from "./Select";
import { sharedSelectStyles } from "./sharedStyles";

export interface CustomMultiSelectProps<T extends OptionType> {
  value?: T[];
  onChange: (selectedOptions: T[]) => void;
  options: T[];
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  searchable?: boolean;
}

const multiSelectStyles = {
  ...sharedSelectStyles,
  control: (
    provided: CSSObjectWithLabel,
    state: { isDisabled: boolean }
  ) => ({
    ...sharedSelectStyles.control(provided, state),
    height: "auto",
  }),
  multiValue: (provided: CSSObjectWithLabel) => ({
    ...provided,
    backgroundColor: "var(--color-neutral-700)",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "var(--color-neutral-200)",
  }),
  multiValueRemove: (provided: CSSObjectWithLabel) => ({
    ...provided,
    color: "var(--color-neutral-400)",
    "&:hover": {
      backgroundColor: "var(--color-red-500)",
      color: "var(--color-neutral-50)",
    },
  }),
};

export function CustomMultiSelect<T extends OptionType>(
  props: CustomMultiSelectProps<T>
): React.JSX.Element {
  const {
    value,
    onChange,
    options,
    disabled = false,
    placeholder = "Escribe para buscar",
    noOptionsMessage = "Sin resultados",
    searchable = true,
  } = props;

  return (
    <Select<T, true, GroupBase<T>>
      isMulti
      value={value}
      placeholder={placeholder}
      options={options}
      onChange={(selected) => onChange([...selected])}
      isDisabled={disabled}
      styles={multiSelectStyles}
      isSearchable={searchable}
      closeMenuOnSelect={false}
      noOptionsMessage={() => noOptionsMessage}
    />
  );
}
