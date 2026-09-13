import { memo } from "react";
import { SIN_TEMPORADA } from "recreativos-air-core/liga";
import type { TemporadaDTO } from "recreativos-air-core/temporada";
import { CustomSelect } from "../../../packages/components/Select/Select";

export const OPCION_TODAS = "-1";

export interface SelectorTemporada {
  temporadas: TemporadaDTO[];
  value?: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  incluirOpcionTodas?: boolean;
  incluirOpcionSinTemporada?: boolean;
}

export const SelectorTemporada = memo((props: SelectorTemporada) => {
  const {
    temporadas,
    value,
    onSelect,
    disabled = false,
    incluirOpcionTodas = false,
    incluirOpcionSinTemporada = false,
  } = props;

  const opciones = [
    ...(incluirOpcionTodas ? [{ value: OPCION_TODAS, label: "Todas" }] : []),
    ...(incluirOpcionSinTemporada
      ? [{ value: SIN_TEMPORADA, label: "Sin temporada" }]
      : []),
    ...temporadas.map((t) => ({
      value: t.id,
      label: t.actual ? `${t.nombre} (actual)` : t.nombre,
    })),
  ];

  return (
    <CustomSelect
      value={opciones.find((o) => o.value === value)}
      onSelect={(selectedOption) => onSelect(String(selectedOption.value))}
      options={opciones}
      disabled={disabled}
      placeholder="Temporada"
    />
  );
});
