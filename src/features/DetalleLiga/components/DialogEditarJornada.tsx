import { useState } from "react";
import type { JornadaDTO } from "recreativos-air-core/liga";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../../packages/components/Button/Button";
import { FormField } from "../../../packages/components/Form/FormField";
import { FormLabel } from "../../../packages/components/Form/FormLabel";
import { TextInput } from "../../../packages/components/TextInput/TextInput";
import { useActualizarJornada } from "../../../shared/api/ligas/useLigas";

type Props = {
  ligaId: string;
  jornada: JornadaDTO | null;
  onClose: () => void;
};

/** Edición de las fechas de una jornada (independiente del resto). */
export const DialogEditarJornada = ({ ligaId, jornada, onClose }: Props) => {
  if (!jornada) return null;
  return (
    <FormEditarJornada key={jornada.numero} ligaId={ligaId} jornada={jornada} onClose={onClose} />
  );
};

const FormEditarJornada = ({
  ligaId,
  jornada,
  onClose,
}: Omit<Props, "jornada"> & { jornada: JornadaDTO }) => {
  const [fechaInicio, setFechaInicio] = useState(jornada.fechaInicio ?? "");
  const [fechaFin, setFechaFin] = useState(jornada.fechaFin ?? "");
  const { mutate: actualizarJornada, isPending } = useActualizarJornada();

  const handleGuardar = () => {
    if (fechaInicio && fechaFin && fechaInicio > fechaFin)
      return toast.error("La fecha de fin debe ser posterior a la de inicio");

    actualizarJornada(
      {
        ligaId,
        numero: jornada.numero,
        data: { fechaInicio: fechaInicio || null, fechaFin: fechaFin || null },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open onOpenChange={(abierto) => !abierto && onClose()}>
      <DialogContent className="top-24 translate-y-0 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="pr-10 text-xl text-primary-text">
            Jornada {jornada.numero}
          </DialogTitle>
          <DialogDescription>Fechas de inicio y fin de la jornada</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGuardar();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField>
              <FormLabel>Inicio</FormLabel>
              <TextInput type="date" value={fechaInicio} onChangeText={setFechaInicio} />
            </FormField>
            <FormField>
              <FormLabel>Fin</FormLabel>
              <TextInput type="date" value={fechaFin} onChangeText={setFechaFin} />
            </FormField>
          </div>

          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
