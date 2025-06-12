import { useState } from "react";
import { Button } from "../../../packages/components/Button/Button";
import type { Enfrentamiento } from "../../../shared/interfaces/Enfrentamiento";

export const IntroducirResultadoForm = ({
  enfrentamiento,
  onUpdate,
}: {
  enfrentamiento: Enfrentamiento;
  onUpdate: (enfrentamiento: Enfrentamiento|null) => void;
}) => {
  const [updatedEnfrentamiento, setUpdatedEnfrentamiento] =
    useState<Enfrentamiento>(enfrentamiento);

  const handleInputChange = (
    index: number,
    field: "golesA" | "golesB",
    value: string
  ) => {
    const updatedPartidos = [...updatedEnfrentamiento.partidos];
    updatedPartidos[index] = {
      ...updatedPartidos[index],
      [field]: value,
    };
    setUpdatedEnfrentamiento({
      ...updatedEnfrentamiento,
      partidos: updatedPartidos,
    });
  };

  return (
    <div className="flex flex-col justify-between h-40">
      <div className="flex my-4">
        <div className="flex flex-col w-30 gap-1 ">
          <p
            title={enfrentamiento.equipoA.nombre}
            className="py-2 px-2 truncate"
          >
            {enfrentamiento.equipoA.nombre}
          </p>
          <p title={enfrentamiento.equipoB.nombre} className="py-2 px-2 truncate">
            {enfrentamiento.equipoB.nombre}
          </p>
        </div>
        <div className="flex flex-row gap-1 ">
          {updatedEnfrentamiento.partidos.map((p, index) => (
            <div
              key={index + p.equipoA.nombre + p.equipoB.nombre}
              className="w-12 flex flex-col gap-1 text-neutral-600"
            >
              <input
                type="number"
                value={p.golesA}
                onChange={(e) =>
                  handleInputChange(index, "golesA", e.target.value)
                }
                className="rounded-md py-2 px-3 bg-neutral-700 text-neutral-100 text-center"
              />
              <input
                type="number"
                value={p.golesB}
                onChange={(e) =>
                  handleInputChange(index, "golesB", e.target.value)
                }
                className="rounded-md py-2 px-3 bg-neutral-700 text-neutral-100 text-center"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <Button variant={"outline"} onClick={() => onUpdate(null)}>
          Descartar
        </Button>
        <Button onClick={() => onUpdate(updatedEnfrentamiento)}>
          Confirmar
        </Button>
      </div>
    </div>
  );
};
