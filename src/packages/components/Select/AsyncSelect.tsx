// CustomAsyncSelect.tsx
"use client";

import { useEffect, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { debounce } from "../../utils/debounce";
import { sharedSelectStyles } from "./sharedStyles";
import type { OptionProps } from "react-select";

interface OptionType {
  value: string | number;
  label: string;
}

export interface AsyncSelectProps<T extends OptionType> {
  value?: T;
  onSelect: (selectedOption: T) => void;
  loadOptions: (inputValue: string | number) => Promise<T[]> | T[];
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  loadingMessage?: string;
  debounceDelay?: number;
  renderOption?: (option: T) => React.ReactNode; // 👈 NUEVO
}

export function CustomAsyncSelect<T extends OptionType>(
  props: AsyncSelectProps<T>
) {
  const {
    value,
    onSelect,
    loadOptions,
    disabled = false,
    placeholder = "Escribe para buscar",
    noOptionsMessage = "Sin resultados",
    loadingMessage = "Cargando...",
    debounceDelay = 250,
    renderOption,
  } = props;

  const handleSelect = (selectedOption: T | null) => {
    if (selectedOption) onSelect(selectedOption);
  };

  const debouncedLoadOptions = useMemo(
    () =>
      debounce(
        (
          inputValue: string,
          callback: (
            options: import("react-select").OptionsOrGroups<
              T,
              import("react-select").GroupBase<T>
            >
          ) => void
        ) => {
          const result = loadOptions(inputValue);
          if (result instanceof Promise) result.then(callback);
          else callback(result);
        },
        debounceDelay
      ),
    [loadOptions, debounceDelay]
  );

  useEffect(() => () => debouncedLoadOptions.cancel(), [debouncedLoadOptions]);

  const CustomOption = ({ innerProps, data }:OptionProps<T>) => {
    if(!renderOption) return <></>
    return <div {...innerProps}>{renderOption(data)}</div>;
  };

  return (
    <AsyncSelect<T>
      value={value}
      placeholder={placeholder}
      loadOptions={debouncedLoadOptions}
      onChange={handleSelect}
      isDisabled={disabled}
      styles={sharedSelectStyles}
      noOptionsMessage={() => noOptionsMessage}
      loadingMessage={() => loadingMessage}
      components={renderOption ? { Option: CustomOption } : undefined}
      isClearable
    />
  );
}
