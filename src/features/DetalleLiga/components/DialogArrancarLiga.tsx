import { Play } from "lucide-react";
import { useState } from "react";
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
import { hoyISO } from "../../../shared/lib/jornadas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (datos: { fechaPrimeraJornada: string; duracionJornadaDias: number }) => void;
  pending?: boolean;
};

/** Diálogo «Arrancar liga»: fecha de la primera jornada y duración en días. */
export const DialogArrancarLiga = ({ open, onOpenChange, onConfirmar, pending }: Props) => {
  const [fechaPrimeraJornada, setFechaPrimeraJornada] = useState(hoyISO());
  const [duracion, setDuracion] = useState("7");

  const handleSubmit = () => {
    const dias = Number(duracion);
    if (!fechaPrimeraJornada) return toast.error("Indica la fecha de la primera jornada");
    if (!Number.isInteger(dias) || dias < 1)
      return toast.error("La duración debe ser de al menos 1 día");
    onConfirmar({ fechaPrimeraJornada, duracionJornadaDias: dias });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-24 translate-y-0 sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="pr-10 text-xl text-primary-text">Arrancar la liga</DialogTitle>
          <DialogDescription>
            Se generarán las jornadas y los enfrentamientos, y los usuarios podrán comenzar a
            introducir resultados. Las fechas de cada jornada se podrán editar después.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FormField>
            <FormLabel>Fecha de la primera jornada</FormLabel>
            <TextInput
              type="date"
              value={fechaPrimeraJornada}
              onChangeText={setFechaPrimeraJornada}
            />
          </FormField>
          <FormField>
            <FormLabel>Duración de cada jornada (días)</FormLabel>
            <TextInput
              type="number"
              inputMode="numeric"
              min={1}
              max={365}
              value={duracion}
              onChangeText={setDuracion}
            />
          </FormField>

          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" icon={Play} disabled={pending} className="flex-1">
              {pending ? "Arrancando..." : "Arrancar liga"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
