import { Check, Plus, Trophy, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "../../packages/components/Button/Button";

type EstadoPaso = "hecho" | "actual" | "pendiente";

const Paso = ({
  n,
  estado,
  titulo,
  children,
}: {
  n: number;
  estado: EstadoPaso;
  titulo: string;
  children?: ReactNode;
}) => (
  <li className="flex gap-3">
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
        estado === "hecho" && "border border-success/40 bg-success/15 text-success",
        estado === "actual" &&
          "bg-primary text-primary-foreground dark:shadow-[0_0_10px_rgb(235_138_31/0.35)]",
        estado === "pendiente" && "border border-input text-muted-foreground"
      )}
    >
      {estado === "hecho" ? <Check size={16} aria-hidden="true" /> : n}
    </span>
    <div className="flex flex-1 flex-col gap-2 pt-[3px]">
      <span
        className={cn(
          "font-display text-base",
          estado === "actual"
            ? "font-bold text-foreground"
            : estado === "hecho"
              ? "font-semibold text-foreground-soft"
              : "font-semibold text-muted-foreground"
        )}
      >
        {titulo}
      </span>
      {estado === "actual" && children}
    </div>
  </li>
);

export interface CaminoProps {
  tieneEquipo: boolean;
  tieneLigasPasadas: boolean;
  ligasAbiertas: number;
  temporada?: string;
  /** Clave de sessionStorage para recordar que se ha cerrado (por usuario). */
  storageKey?: string;
}

const leerCerrado = (key?: string) => {
  if (!key) return false;
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

/** Camino a la liga (sustituye a CtaLigasDisponibles). Solo sin liga activa. */
export const CaminoALaLiga = ({
  tieneEquipo,
  tieneLigasPasadas,
  ligasAbiertas,
  temporada,
  storageKey,
}: CaminoProps) => {
  const navigate = useNavigate();
  const [cerrado, setCerrado] = useState(() => leerCerrado(storageKey));
  const pasoActual = tieneEquipo ? 2 : 1;

  const cerrar = () => {
    setCerrado(true);
    if (storageKey) {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* sessionStorage no disponible */
      }
    }
  };

  if (cerrado) return null;

  const titulo = tieneLigasPasadas ? "Tus ligas han terminado" : "Aún no estás en ninguna liga";

  const descripcionLigas =
    ligasAbiertas > 0
      ? `Hay ${ligasAbiertas} ${ligasAbiertas === 1 ? "liga abierta" : "ligas abiertas"} a inscripción${temporada ? ` en ${temporada}` : ""}.`
      : "Ahora mismo no hay ligas abiertas a inscripción. Estate atento a las próximas competiciones.";

  return (
    <section className="relative flex flex-col gap-3.5 rounded-card-lg border border-primary/35 bg-card p-4">
      <div className="flex items-center gap-2 pr-10 text-primary-text">
        <Trophy size={18} aria-hidden="true" />
        <h2 className="font-display text-lg font-bold normal-case tracking-normal">{titulo}</h2>
      </div>
      <button
        type="button"
        onClick={cerrar}
        aria-label="Cerrar"
        className="absolute top-1.5 right-1.5 flex size-11 items-center justify-center rounded-input text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
      >
        <X size={18} aria-hidden="true" />
      </button>
      <ol className="flex flex-col gap-3.5">
        <Paso n={1} estado={pasoActual > 1 ? "hecho" : "actual"} titulo="Crea tu equipo">
          <Button icon={Plus} onClick={() => navigate("/crear-equipo")} className="h-[46px]">
            Crear equipo
          </Button>
        </Paso>
        <Paso n={2} estado={pasoActual === 2 ? "actual" : "pendiente"} titulo="Inscríbete en una liga">
          <span className="text-[13px] text-foreground-soft">{descripcionLigas}</span>
          <Button
            variant={ligasAbiertas > 0 ? "primary" : "outline"}
            onClick={() => navigate("/competiciones")}
            className="h-[46px]"
          >
            {ligasAbiertas > 0 ? "Ver ligas disponibles" : "Ver competiciones"}
          </Button>
        </Paso>
        <Paso n={3} estado="pendiente" titulo="Esperando confirmación..." />
      </ol>
    </section>
  );
};
