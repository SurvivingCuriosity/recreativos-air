import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../../packages/components/Button/Button";
import { FormLabel } from "../../../packages/components/Form/FormLabel";
import { TextInput } from "../../../packages/components/TextInput/TextInput";

/** Caja «Ubicaciones» (design/screens/CrearLiga.html / LigaAjustes.html). */
export const EditorUbicaciones = ({
  ubicaciones,
  onChange,
  id = "ubicacion",
}: {
  ubicaciones: string[];
  onChange: (ubicaciones: string[]) => void;
  id?: string;
}) => {
  const [ubicacionActual, setUbicacionActual] = useState("");

  const handleAgregar = () => {
    const trimmed = ubicacionActual.trim();
    if (!trimmed) return toast.error("Introduce una ubicación válida");
    if (ubicaciones.includes(trimmed)) return toast.error("Esa ubicación ya está añadida");
    onChange([...ubicaciones, trimmed]);
    setUbicacionActual("");
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-button border border-border bg-card-2 p-3">
      <FormLabel htmlFor={id}>Ubicaciones</FormLabel>

      <div className="flex items-center gap-2">
        <TextInput
          id={id}
          placeholder="Añadir ubicación..."
          value={ubicacionActual}
          onChangeText={setUbicacionActual}
          className="min-w-0 flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAgregar();
            }
          }}
        />
        <Button
          onClick={handleAgregar}
          variant="outline"
          icon={Plus}
          aria-label="Añadir ubicación"
          className="rounded-input"
        />
      </div>

      {ubicaciones.length > 0 && (
        <ul className="flex flex-col gap-2">
          {ubicaciones.map((u, i) => (
            <li
              key={i}
              className="flex min-h-11 items-center justify-between gap-2 rounded-[10px] bg-muted py-0 pr-1 pl-3 text-sm text-foreground-soft"
            >
              <span className="truncate">{u}</span>
              <button
                type="button"
                className="min-h-11 shrink-0 px-2.5 text-[13px] font-semibold text-destructive hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => onChange(ubicaciones.filter((_, j) => j !== i))}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
