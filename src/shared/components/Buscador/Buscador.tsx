import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Input de búsqueda con icono (design/screens/AdminEquipos.html). */
export const Buscador = ({
  placeholder,
  onChangeText,
  defaultValue,
}: {
  placeholder: string;
  onChangeText: (value: string) => void;
  defaultValue?: string;
}) => (
  <div className="relative">
    <Search
      size={18}
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
    />
    <Input
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChangeText(e.target.value)}
      className="pl-10"
    />
  </div>
);
