import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface OptionType {
  value: string | number;
  label: string;
  imageUrl?: string;
}

export interface CustomSelectProps<T extends OptionType> {
  value?: T;
  onSelect: (selectedOption: T) => void;
  options: T[];
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  loadingMessage?: string;
  searchable?: boolean;
}

const OptionLabel = ({ option }: { option: OptionType }) => (
  <span className="flex items-center gap-2">
    {option.imageUrl && (
      <img src={option.imageUrl} alt="" className="size-5 rounded-sm" />
    )}
    <span className="truncate">{option.label}</span>
  </span>
);

/**
 * Select de opción única.
 * - `searchable=false` → Select de shadcn (nativo de teclado, sin filtro).
 * - `searchable=true`  → Popover + Command con filtro de texto.
 */
export function CustomSelect<T extends OptionType>(
  props: CustomSelectProps<T>
): React.JSX.Element {
  const {
    value,
    onSelect,
    options,
    disabled = false,
    placeholder = "Escribe para buscar",
    noOptionsMessage = "Sin resultados",
    searchable = false,
  } = props;

  const [open, setOpen] = useState(false);

  if (!searchable) {
    return (
      <Select
        value={value !== undefined ? String(value.value) : undefined}
        onValueChange={(v) => {
          const opt = options.find((o) => String(o.value) === v);
          if (opt) onSelect(opt);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" aria-label={placeholder}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={String(o.value)} value={String(o.value)}>
              <OptionLabel option={o} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-12 w-full items-center justify-between gap-2 rounded-input border border-border bg-card px-3 text-left text-[15px] text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary dark:focus-visible:shadow-glow-focus disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {value ? <OptionLabel option={value} /> : placeholder}
          </span>
          <ChevronsUpDown size={16} className="shrink-0 opacity-60" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{noOptionsMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={String(o.value)}
                  value={o.label}
                  onSelect={() => {
                    onSelect(o);
                    setOpen(false);
                  }}
                >
                  <OptionLabel option={o} />
                  <Check
                    size={16}
                    className={cn(
                      "ml-auto",
                      value?.value === o.value ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
