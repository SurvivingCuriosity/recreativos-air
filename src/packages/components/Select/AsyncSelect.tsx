"use client";

import { useEffect, useMemo, useState } from "react";
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
  emptyInputMessage?: string; // 👈 NUEVO
  loadingMessage?: string;
  debounceDelay?: number;
  renderOption?: (option: T) => React.ReactNode;
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
    emptyInputMessage = "Escribe para buscar...", // 👈 NUEVO
    loadingMessage = "Cargando...",
    debounceDelay = 250,
    renderOption,
  } = props;

  const [inputValue, setInputValue] = useState("");

  const handleSelect = (selectedOption: T | null) => {
    if (selectedOption) onSelect(selectedOption);
  };

  const debouncedLoadOptions = useMemo(
    () =>
      debounce(
        (
          input: string,
          callback: (
            options: import("react-select").OptionsOrGroups<
              T,
              import("react-select").GroupBase<T>
            >
          ) => void
        ) => {
          if (!input.trim()) {
            callback([]);
            return;
          }
          const result = loadOptions(input);
          if (result instanceof Promise) result.then(callback);
          else callback(result);
        },
        debounceDelay
      ),
    [loadOptions, debounceDelay]
  );

  useEffect(() => () => debouncedLoadOptions.cancel(), [debouncedLoadOptions]);

  const CustomOption = ({ innerProps, data }: OptionProps<T>) => {
    if (!renderOption) return <></>;
    return <div {...innerProps}>{renderOption(data)}</div>;
  };

  return (
    <AsyncSelect<T>
      value={value}
      placeholder={placeholder}
      loadOptions={debouncedLoadOptions}
      onInputChange={(newValue) => setInputValue(newValue)} // 👈 guardamos el input
      onChange={handleSelect}
      isDisabled={disabled}
      styles={sharedSelectStyles}
      noOptionsMessage={() =>
        !inputValue.trim() ? emptyInputMessage : noOptionsMessage
      } // 👈 muestra mensaje según estado
      loadingMessage={() => loadingMessage}
      components={renderOption ? { Option: CustomOption } : undefined}
      isClearable
    />
  );
}
