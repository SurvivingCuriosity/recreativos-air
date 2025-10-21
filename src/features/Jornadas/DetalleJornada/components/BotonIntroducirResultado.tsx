import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../../packages/components/Button/Button";
import { Window } from "../../../../packages/components/Window/Window";
import { useProponerResultado } from "../../../../shared/api/enfrentamientos/hooks";
import { useLigaById } from "../../../../shared/api/ligas/useLigas";
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";

type Props = {
  enfrentamiento: EnfrentamientoDTO;
  idEquipo: string;
};

export const BotonIntroducirResultado = ({
  enfrentamiento,
  idEquipo,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [partidos, setPartidos] = useState(enfrentamiento.partidos);
  const { mutate: proponerResultado, isPending } = useProponerResultado();
  const queryClient = useQueryClient();

  const { data: liga } = useLigaById(enfrentamiento.idLiga);

const resultadoValido = () => {
  const goles = liga?.configuracion.golesParaGanar || 10
  // Si algún partido NO cumple la condición (ninguno llega a 10), error
  const invalido = partidos.some(
    (p) => p.golesA < goles && p.golesB < goles
  );

  if (invalido) {
    toast.error(`En todos los partidos, uno de los equipos debe llegar a ${goles} goles`);
    return false;
  }

  // Si algún partido tiene ambos con más de goles, también es inválido
  const ambosDiez = partidos.some(
    (p) => p.golesA > goles || p.golesB > goles
  );

  if (ambosDiez) {
    toast.error(`Ningún equipo puede superar los ${goles} goles por partido`);
    return false;
  }

  return true;
};


  const handleChange = (
    index: number,
    field: "golesA" | "golesB",
    value: string
  ) => {
    const nuevos = [...partidos];
    nuevos[index] = { ...nuevos[index], [field]: Number(value) };
    setPartidos(nuevos);
  };

  const handleGuardar = () => {
    if (!resultadoValido()) return;
    proponerResultado(
      { equipoId: idEquipo, partidos, enfrentamientoId: enfrentamiento.id },
      {
        onSuccess: () => {
          toast.success("Resultado propuesto");
          queryClient.invalidateQueries({
            queryKey: ["enfrentamientos", enfrentamiento.id],
          });
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={isPending}>
        Introducir resultado
      </Button>

      {open && (
        <Window titulo="Proponer resultado" onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-1 overflow-x-auto p-2">
              <div className="flex flex-col justify-between gap-1">
                <p className="bg-neutral-800 h-full truncate max-w-23 flex items-center justify-center px-3 text-sm rounded-lg">
                  {enfrentamiento.equipoA.nombre}
                </p>
                <p className="bg-neutral-800 h-full truncate max-w-23 flex items-center justify-center px-3 text-sm rounded-lg">
                  {enfrentamiento.equipoB.nombre}
                </p>
              </div>
              {partidos.map((_p, index) => (
                <div key={index} className="w-10 flex flex-col gap-1">
                  <input
                    type="number"
                    defaultValue={undefined}
                    value={undefined}
                    max={liga?.configuracion.golesParaGanar}
                    onChange={(e) =>
                      handleChange(index, "golesA", e.target.value)
                    }
                    className="rounded-md p-2 bg-neutral-700 text-neutral-100 text-center"
                  />
                  <input
                    type="number"
                    value={undefined}
                    defaultValue={undefined}
                    max={liga?.configuracion.golesParaGanar}
                    onChange={(e) =>
                      handleChange(index, "golesB", e.target.value)
                    }
                    className="rounded-md p-2 bg-neutral-700 text-neutral-100 text-center"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGuardar} disabled={isPending}>
                Guardar
              </Button>
            </div>
          </div>
        </Window>
      )}
    </>
  );
};
