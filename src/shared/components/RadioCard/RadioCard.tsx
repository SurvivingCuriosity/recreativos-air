import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioCardOption<T extends string> {
  value: T;
  label: string;
}

/**
 * RadioGroup en tarjeta (design/screens/CrearEquipo.html): opciones en fila,
 * la activa con borde/fondo primary. Alto mínimo 46 px.
 */
export function RadioCards<T extends string>({
  value,
  onChange,
  options,
  name,
  ariaLabel,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: RadioCardOption<T>[];
  name?: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onChange(v as T)}
      name={name}
      aria-label={ariaLabel}
      className={cn("flex gap-2", className)}
    >
      {options.map((o) => {
        const id = `${name ?? "radio"}-${o.value}`;
        const active = o.value === value;
        return (
          <label
            key={o.value}
            htmlFor={id}
            className={cn(
              "flex min-h-[46px] flex-1 cursor-pointer items-center gap-2 rounded-input border px-3 text-[13px] font-semibold transition-colors",
              active
                ? "border-primary-text/60 bg-primary/10 text-primary-text"
                : "border-border bg-card text-foreground-soft hover:bg-muted"
            )}
          >
            <RadioGroupItem
              id={id}
              value={o.value}
              className="size-4 border-input data-[state=checked]:border-primary [&_svg]:fill-primary [&_svg]:stroke-primary"
            />
            <span>{o.label}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
