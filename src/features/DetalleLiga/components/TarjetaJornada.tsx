import { CalendarDays, ChevronDown, Pencil } from "lucide-react";
import type { ConfiguracionLigaDTO } from "recreativos-air-core/liga";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Button } from "../../../packages/components/Button/Button";
import { ProgressBar } from "../../../shared/components/ProgressBar/ProgressBar";
import { TarjetaEnfrentamiento } from "../../../shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento";
import {
  formatRangoJornada,
  nombreJornada,
  type GrupoJornada,
} from "../../../shared/lib/jornadas";

type Props = {
  grupo: GrupoJornada;
  cfgLiga?: ConfiguracionLigaDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditar?: () => void;
  onClickEnfrentamiento: (id: string) => void;
};

/** Tarjeta colapsable de jornada: cabecera con fechas y progreso, enfrentamientos dentro. */
export const TarjetaJornada = ({
  grupo,
  cfgLiga,
  open,
  onOpenChange,
  onEditar,
  onClickEnfrentamiento,
}: Props) => {
  const porcentaje = grupo.total ? Math.round((grupo.jugados / grupo.total) * 100) : 0;

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className={cn(
        "overflow-hidden rounded-card border bg-card text-foreground",
        open ? "border-input" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 pr-2">
        <CollapsibleTrigger className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring">
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="flex items-center justify-between gap-2">
              <span className="truncate font-display text-[17px] font-bold text-primary-text">
                {nombreJornada(grupo.numero)}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-foreground-soft">
                <CalendarDays size={14} aria-hidden="true" />
                {formatRangoJornada(grupo.jornada)}
              </span>
            </span>
            <ProgressBar
              progress={porcentaje}
              label={`${grupo.jugados}/${grupo.total} enfrentamientos disputados`}
            />
          </span>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={cn(
              "shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>

        {onEditar && grupo.jornada && (
          <Button
            icon={Pencil}
            variant="outline-neutral"
            aria-label={`Editar fechas de la ${nombreJornada(grupo.numero).toLowerCase()}`}
            onClick={onEditar}
          />
        )}
      </div>

      <CollapsibleContent className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
        <ul className="flex flex-col gap-3 border-t border-border p-3">
          {grupo.enfrentamientos.map((enf) => (
            <li key={enf.id}>
              <TarjetaEnfrentamiento
                enfrentamiento={enf}
                onClick={() => onClickEnfrentamiento(enf.id)}
                cfgLiga={cfgLiga}
              />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
