import { Check, ChevronsUpDown, X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type OptionType } from "./Select";

export interface CustomMultiSelectProps<T extends OptionType> {
  value?: T[];
  onChange: (selectedOptions: T[]) => void;
  options: T[];
  disabled?: boolean;
  placeholder?: string;
  noOptionsMessage?: string;
  searchable?: boolean;
}

/** Multiselección (Popover + Command) con Badges de lo elegido (§5). */
export function CustomMultiSelect<T extends OptionType>(
  props: CustomMultiSelectProps<T>
): React.JSX.Element {
  const {
    value = [],
    onChange,
    options,
    disabled = false,
    placeholder = "Escribe para buscar",
    noOptionsMessage = "Sin resultados",
  } = props;

  const [open, setOpen] = useState(false);

  const isSelected = (o: T) => value.some((v) => v.value === o.value);

  const toggle = (o: T) => {
    if (isSelected(o)) onChange(value.filter((v) => v.value !== o.value));
    else onChange([...value, o]);
  };

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
            "flex min-h-12 w-full items-center justify-between gap-2 rounded-input border border-border bg-card px-3 py-2 text-left text-[15px] text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary dark:focus-visible:shadow-glow-focus disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <span className="flex min-w-0 flex-wrap items-center gap-1.5">
            {value.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {value.map((v) => (
              <Badge
                key={String(v.value)}
                variant="secondary"
                className="gap-1 rounded-chip border-border bg-muted pr-1 text-xs text-foreground"
              >
                {v.label}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Quitar ${v.label}`}
                  className="flex size-5 items-center justify-center rounded-sm hover:bg-destructive/20 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      toggle(v);
                    }
                  }}
                >
                  <X size={12} aria-hidden="true" />
                </span>
              </Badge>
            ))}
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
                <CommandItem key={String(o.value)} value={o.label} onSelect={() => toggle(o)}>
                  <span className="truncate">{o.label}</span>
                  <Check
                    size={16}
                    className={cn("ml-auto", isSelected(o) ? "opacity-100" : "opacity-0")}
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
