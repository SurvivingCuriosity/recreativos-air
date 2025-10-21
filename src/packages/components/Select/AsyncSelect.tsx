"use client";

import { useEffect, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { debounce } from "../../utils/debounce";
import { sharedSelectStyles } from "./sharedStyles";

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
  } = props;

  const handleSelect = (selectedOption: T | null) => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  // Usamos useMemo para crear la función debounced que solo se recalcula cuando loadOptions o debounceDelay cambian
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
          if (result instanceof Promise) {
            result.then((options) => callback(options));
          } else {
            callback(result);
          }
        },
        debounceDelay
      ),
    [loadOptions, debounceDelay]
  );

  // Cancelamos el timer al desmontar el componente
  useEffect(() => {
    return () => {
      debouncedLoadOptions.cancel();
    };
  }, [debouncedLoadOptions]);

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
    />
  );
}
