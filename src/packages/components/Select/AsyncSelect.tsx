import { ChevronsUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { debounce } from "../../utils/debounce";

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
  emptyInputMessage?: string;
  loadingMessage?: string;
  debounceDelay?: number;
  renderOption?: (option: T) => React.ReactNode;
}

/** Selector asíncrono (Popover + Command) con búsqueda debounced. */
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
    emptyInputMessage = "Escribe para buscar...",
    loadingMessage = "Cargando...",
    debounceDelay = 250,
    renderOption,
  } = props;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedLoad = useMemo(
    () =>
      debounce((input: string) => {
        if (!input.trim()) {
          setItems([]);
          setLoading(false);
          return;
        }
        Promise.resolve(loadOptions(input))
          .then((result) => setItems(result))
          .finally(() => setLoading(false));
      }, debounceDelay),
    [loadOptions, debounceDelay]
  );

  useEffect(() => () => debouncedLoad.cancel(), [debouncedLoad]);

  const handleQueryChange = (input: string) => {
    setQuery(input);
    if (input.trim()) setLoading(true);
    debouncedLoad(input);
  };

  const status = !query.trim()
    ? emptyInputMessage
    : loading
      ? loadingMessage
      : items.length === 0
        ? noOptionsMessage
        : null;

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
          <span className="flex min-w-0 items-center gap-2">
            {!value && <Search size={16} className="shrink-0 opacity-60" aria-hidden="true" />}
            <span className="truncate">{value ? value.label : placeholder}</span>
          </span>
          <ChevronsUpDown size={16} className="shrink-0 opacity-60" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={handleQueryChange}
          />
          <CommandList>
            {status ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{status}</p>
            ) : (
              <CommandGroup>
                {items.map((o) => (
                  <CommandItem
                    key={String(o.value)}
                    value={String(o.value)}
                    onSelect={() => {
                      onSelect(o);
                      setOpen(false);
                      setQuery("");
                      setItems([]);
                    }}
                  >
                    {renderOption ? renderOption(o) : o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
