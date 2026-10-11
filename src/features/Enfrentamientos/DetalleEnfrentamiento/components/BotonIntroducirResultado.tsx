import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { EnfrentamientoDTO } from "recreativos-air-core/enfrentamiento";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../../../packages/components/Button/Button";
import { useProponerResultado } from "../../../../shared/api/enfrentamientos/hooks";
import { useLigaById } from "../../../../shared/api/ligas/useLigas";

type Props = {
  enfrentamiento: EnfrentamientoDTO;
  idEquipo: string;
};

const inputClass =
  "h-12 w-full min-w-0 rounded-[10px] border border-input bg-muted text-center font-display text-lg font-bold text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary dark:focus-visible:shadow-glow-focus";

/** «Introducir resultado» + Dialog «Proponer resultado» (design/screens/JornadaProponer.html). */
export const BotonIntroducirResultado = ({ enfrentamiento, idEquipo }: Props) => {
  const [open, setOpen] = useState(false);
  const [partidos, setPartidos] = useState(enfrentamiento.partidos);
  const { mutate: proponerResultado, isPending } = useProponerResultado();
  const queryClient = useQueryClient();

  const { data: liga } = useLigaById(enfrentamiento.idLiga);
  const golesParaGanar = liga?.configuracion.golesParaGanar || 10;

  const resultadoValido = () => {
    const invalido = partidos.some((p) => p.golesA < golesParaGanar && p.golesB < golesParaGanar);
    if (invalido) {
      toast.error(
        `En todos los partidos, uno de los equipos debe llegar a ${golesParaGanar} goles`
      );
      return false;
    }
    const excedido = partidos.some((p) => p.golesA > golesParaGanar || p.golesB > golesParaGanar);
    if (excedido) {
      toast.error(`Ningún equipo puede superar los ${golesParaGanar} goles por partido`);
      return false;
    }
    return true;
  };

  const handleChange = (index: number, field: "golesA" | "golesB", value: string) => {
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

  const { equipoA, equipoB } = enfrentamiento;

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={isPending}>
        Introducir resultado
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-24 translate-y-0 sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle className="pr-10 text-xl text-primary-text">Proponer resultado</DialogTitle>
            <DialogDescription className="sr-only">
              Introduce los goles de cada partido entre {equipoA.nombre} y {equipoB.nombre}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardar();
            }}
            className="flex flex-col gap-4"
          >
            <div className="overflow-x-auto">
              <div
                className="grid min-w-full items-end gap-2"
                style={{
                  gridTemplateColumns: `104px repeat(${partidos.length}, minmax(44px, 1fr))`,
                }}
              >
                <div className="flex flex-col gap-2">
                  <span className="flex h-12 items-center truncate rounded-[10px] bg-muted px-2.5 text-[13px] font-semibold text-foreground">
                    {equipoA.nombre}
                  </span>
                  <span className="flex h-12 items-center truncate rounded-[10px] bg-muted px-2.5 text-[13px] font-semibold text-foreground">
                    {equipoB.nombre}
                  </span>
                </div>
                {partidos.map((p, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <span className="text-center text-[11px] font-semibold text-muted-foreground">
                      P{index + 1}
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={golesParaGanar}
                      aria-label={`Partido ${index + 1}, goles ${equipoA.nombre}`}
                      value={Number.isFinite(p.golesA) ? p.golesA : ""}
                      onChange={(e) => handleChange(index, "golesA", e.target.value)}
                      className={inputClass}
                      autoFocus={index === 0}
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={golesParaGanar}
                      aria-label={`Partido ${index + 1}, goles ${equipoB.nombre}`}
                      value={Number.isFinite(p.golesB) ? p.golesB : ""}
                      onChange={(e) => handleChange(index, "golesB", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="flex-row gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
