import { memo } from "react";
import { EstadoEnfrentamientoConOpcionCualquiera } from "recreativos-air-core/enfrentamiento";
import { CustomSelect } from "../../../packages/components/Select/Select";

export interface SelectorEstadoEnfrentamiento {
  value: EstadoEnfrentamientoConOpcionCualquiera;
  onSelect: (selectedOption: EstadoEnfrentamientoConOpcionCualquiera) => void;
  disabled?: boolean;
  incluirOpcionTodos?: boolean;
}

/** Filtro de estado con el vocabulario único de DESIGN.md §6.4. */
export const SelectorEstadoEnfrentamiento = memo(
  (props: SelectorEstadoEnfrentamiento) => {
    const { value, onSelect, disabled = false } = props;

    const estadoEnfrentamientoOptions = [
      {
        value: EstadoEnfrentamientoConOpcionCualquiera.Cualquiera,
        label: "Cualquiera",
      },
      {
        value: EstadoEnfrentamientoConOpcionCualquiera.ConfirmarResultado,
        label: "Esperando al admin",
      },
      {
        value: EstadoEnfrentamientoConOpcionCualquiera.CorroborarResultado,
        label: "Esperando al rival",
      },
      {
        value: EstadoEnfrentamientoConOpcionCualquiera.Jugado,
        label: "Jugado",
      },
      {
        value: EstadoEnfrentamientoConOpcionCualquiera.SinJugar,
        label: "No jugado",
      },
    ];

    return (
      <CustomSelect
        value={estadoEnfrentamientoOptions.find((o) => o.value === value)}
        onSelect={(selectedOption) => {
          onSelect(selectedOption.value);
        }}
        options={estadoEnfrentamientoOptions}
        disabled={disabled}
        placeholder="Cualquiera"
      />
    );
  }
);
