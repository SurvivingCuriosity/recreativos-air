import { useState } from "react";
import toast from "react-hot-toast";
import type { TemporadaDTO } from "recreativos-air-core/temporada";
import { Button } from "../../../packages/components/Button/Button";
import { FormField } from "../../../packages/components/Form/FormField";
import { FormLabel } from "../../../packages/components/Form/FormLabel";
import { CustomMultiSelect } from "../../../packages/components/Select/MultiSelect";
import { TextInput } from "../../../packages/components/TextInput/TextInput";
import { useLigas } from "../../../shared/api/ligas/useLigas";

export interface TemporadaFormData {
  nombre: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  ligas: string[];
}

interface TemporadaFormProps {
  initial?: TemporadaDTO;
  onSubmit: (data: TemporadaFormData) => void;
  isPending: boolean;
  submitLabel: string;
}

export const TemporadaForm = ({
  initial,
  onSubmit,
  isPending,
  submitLabel,
}: TemporadaFormProps) => {
  const { data: ligas } = useLigas();

  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [fechaInicio, setFechaInicio] = useState(initial?.fechaInicio ?? "");
  const [fechaFin, setFechaFin] = useState(initial?.fechaFin ?? "");
  const [ligasSeleccionadas, setLigasSeleccionadas] = useState<string[]>(
    () => ligas?.filter((l) => l.temporada === initial?.id).map((l) => l.id) ?? []
  );

  const opcionesLigas =
    ligas?.map((l) => ({
      value: l.id,
      label:
        l.temporada && l.temporada !== initial?.id
          ? `${l.nombre} (en otra temporada)`
          : l.nombre,
    })) ?? [];

  const handleSubmit = () => {
    if (!nombre.trim()) return toast.error("Introduce un nombre válido");
    if (fechaInicio && fechaFin && fechaInicio > fechaFin)
      return toast.error("La fecha de fin debe ser posterior a la de inicio");

    onSubmit({
      nombre: nombre.trim(),
      fechaInicio: fechaInicio || null,
      fechaFin: fechaFin || null,
      ligas: ligasSeleccionadas,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FormField>
        <FormLabel>Nombre</FormLabel>
        <TextInput
          placeholder="Nombre de la temporada"
          value={nombre}
          onChangeText={setNombre}
        />
      </FormField>

      <div className="flex gap-2">
        <FormField>
          <FormLabel>Fecha inicio</FormLabel>
          <TextInput
            type="date"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />
        </FormField>
        <FormField>
          <FormLabel>Fecha fin</FormLabel>
          <TextInput type="date" value={fechaFin} onChangeText={setFechaFin} />
        </FormField>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-md">
        <FormLabel>Ligas de la temporada</FormLabel>
        <CustomMultiSelect
          value={opcionesLigas.filter((o) =>
            ligasSeleccionadas.includes(o.value)
          )}
          onChange={(selected) =>
            setLigasSeleccionadas(selected.map((o) => o.value))
          }
          options={opcionesLigas}
          placeholder="Buscar liga"
        />
      </div>

      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
};
