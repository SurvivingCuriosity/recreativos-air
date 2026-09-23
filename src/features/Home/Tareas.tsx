import { ChevronRight, Hand, ShieldCheck, UserPlus, type LucideIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Button } from "../../packages/components/Button/Button";
import { useResponderInvitacion } from "../../shared/api/equipos/hooks/useResponderInvitacion";
import { useAprobarInscripcion } from "../../shared/api/ligas/useLigas";
import { formatMarcador, type Tarea } from "./useTareas";

type Tono = "primary" | "neon" | "destructive";

const tonoClass: Record<Tono, { icono: string; kicker: string; borde: string }> = {
  primary: {
    icono: "border-primary/35 bg-primary/13 text-primary-text",
    kicker: "text-primary-text",
    borde: "border-primary/40",
  },
  neon: {
    icono: "border-secondary-neon/35 bg-secondary-neon/13 text-secondary-neon",
    kicker: "text-secondary-neon",
    borde: "border-secondary-neon/40",
  },
  destructive: {
    icono: "border-destructive/35 bg-destructive/13 text-destructive",
    kicker: "text-destructive",
    borde: "border-destructive/40",
  },
};

const IconoTarea = ({ icon: I, tono, size }: { icon: LucideIcon; tono: Tono; size: 36 | 40 }) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center justify-center border",
      size === 40 ? "size-10 rounded-input" : "size-9 rounded-[10px]",
      tonoClass[tono].icono
    )}
  >
    <I size={size === 40 ? 20 : 18} aria-hidden="true" />
  </span>
);

/* ---------------- TaskCard (usuario) ---------------- */

export const TaskCard = ({
  tono,
  icon,
  kicker,
  titulo,
  marcador,
  meta,
  acciones,
  saliendo,
}: {
  tono: Tono;
  icon: LucideIcon;
  kicker: string;
  titulo: string;
  marcador?: string;
  meta: string;
  acciones: ReactNode;
  saliendo?: boolean;
}) => (
  <article
    className={cn(
      "flex flex-col gap-3 rounded-[18px] border bg-card p-3.5 transition-opacity duration-200",
      tonoClass[tono].borde,
      saliendo && "pointer-events-none opacity-0"
    )}
  >
    <div className="flex items-start gap-3">
      <IconoTarea icon={icon} tono={tono} size={40} />
      <div className="flex min-w-0 flex-col gap-[3px]">
        <span className={cn("text-xs font-bold tracking-[0.06em] uppercase", tonoClass[tono].kicker)}>
          {kicker}
        </span>
        <span className="font-display text-[17px] leading-[1.2] font-bold text-foreground">
          {titulo}
        </span>
        {marcador && (
          <span className="font-display text-[15px] font-semibold tracking-[0.02em] text-foreground tabular-nums">
            {marcador}
          </span>
        )}
        <span className="text-[13px] text-foreground-soft">{meta}</span>
      </div>
    </div>
    <div className="flex gap-2">{acciones}</div>
  </article>
);

/* ---------------- TaskRow (admin) ---------------- */

export const TaskRow = ({
  tono,
  icon,
  titulo,
  meta,
  href,
  accion,
  saliendo,
}: {
  tono: Tono;
  icon: LucideIcon;
  titulo: string;
  meta: string;
  href: string;
  accion?: ReactNode;
  saliendo?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(href)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
          e.preventDefault();
          navigate(href);
        }
      }}
      className={cn(
        "flex min-h-16 cursor-pointer items-center gap-2.5 rounded-button border border-border bg-card px-3 py-2.5 text-foreground transition-[opacity,border-color] duration-200 hover:border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        saliendo && "pointer-events-none opacity-0"
      )}
    >
      <IconoTarea icon={icon} tono={tono} size={36} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-display text-[15px] leading-[1.2] font-bold">{titulo}</span>
        <span className="truncate text-xs text-foreground-soft">{meta}</span>
      </span>
      {accion}
      <ChevronRight size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
    </div>
  );
};

/* ---------------- Render por tipo ---------------- */

const InvitacionCard = ({
  tarea,
  onResuelta,
}: {
  tarea: Extract<Tarea, { tipo: "invitacion" }>;
  onResuelta: (id: string) => void;
}) => {
  const { mutate, isPending } = useResponderInvitacion();
  const companeros = tarea.equipo.jugadores
    .filter((j) => j.estado !== EstadoPend && j.nombre)
    .map((j) => j.nombre);
  const responder = (aceptar: boolean) =>
    mutate(
      { equipoId: tarea.equipo.id, aceptar },
      { onSuccess: () => onResuelta(tarea.id) }
    );
  return (
    <TaskCard
      tono="neon"
      icon={UserPlus}
      kicker="Invitación"
      titulo={tarea.equipo.nombre}
      meta={`Has sido invitado a este equipo${companeros.length ? ` · con ${companeros.join(", ")}` : ""}`}
      acciones={
        <>
          <Button onClick={() => responder(true)} disabled={isPending} className="h-11 flex-1">
            Aceptar
          </Button>
          <Button
            variant="outline"
            onClick={() => responder(false)}
            disabled={isPending}
            className="h-11 flex-1"
          >
            Rechazar
          </Button>
        </>
      }
    />
  );
};
// Compañeros = jugadores que no son mi propio registro pendiente
const EstadoPend = "PENDIENTE";

const ResultadoCard = ({ tarea }: { tarea: Extract<Tarea, { tipo: "resultado" }> }) => {
  const { enfrentamiento: enf, liga } = tarea;
  const propuso =
    enf.equipoA.id === enf.resultadoPropuestoPor ? enf.equipoA : enf.equipoB;
  return (
    <TaskCard
      tono="primary"
      icon={Hand}
      kicker="Te toca aceptar"
      titulo={`${enf.equipoA.nombre} vs ${enf.equipoB.nombre}`}
      marcador={formatMarcador(enf)}
      meta={`Resultado propuesto por ${propuso.nombre}${liga ? ` · ${liga.nombre}` : ""}`}
      acciones={
        <Link
          to={`/jornadas/${enf.id}`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-button border border-primary bg-primary/5 px-3.5 font-display text-[15px] font-bold text-primary-text hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span>Revisar resultado</span>
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      }
    />
  );
};

const AdminResultadoRow = ({ tarea }: { tarea: Extract<Tarea, { tipo: "admin-resultado" }> }) => {
  const { enfrentamiento: enf, liga } = tarea;
  return (
    <TaskRow
      tono="neon"
      icon={ShieldCheck}
      titulo={`${enf.equipoA.nombre} vs ${enf.equipoB.nombre}`}
      meta={`${formatMarcador(enf)}${liga ? ` · ${liga.nombre}` : ""}`}
      href={`/jornadas/${enf.id}`}
    />
  );
};

const AdminInscripcionRow = ({
  tarea,
  onResuelta,
}: {
  tarea: Extract<Tarea, { tipo: "admin-inscripcion" }>;
  onResuelta: (id: string) => void;
}) => {
  const { mutate, isPending } = useAprobarInscripcion();
  const { liga, equipoLiga } = tarea;
  const jugadores = equipoLiga.equipo.jugadores.map((j) => j.nombre).join(", ");
  return (
    <TaskRow
      tono="destructive"
      icon={Hand}
      titulo={equipoLiga.equipo.nombre}
      meta={`${liga.nombre} · ${jugadores}`}
      href={`/equipos/${equipoLiga.equipo.id}`}
      accion={
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            mutate(
              { aprobar: true, ligaId: liga.id, equipoId: equipoLiga.equipo.id },
              { onSuccess: () => onResuelta(tarea.id) }
            );
          }}
          className="h-10 shrink-0 rounded-input bg-linear-to-b from-primary-hi to-primary px-3.5 font-display text-sm font-bold text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.4)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          Aceptar
        </button>
      }
    />
  );
};

export const TareaItem = ({
  tarea,
  onResuelta,
}: {
  tarea: Tarea;
  onResuelta: (id: string) => void;
}) => {
  switch (tarea.tipo) {
    case "invitacion":
      return <InvitacionCard tarea={tarea} onResuelta={onResuelta} />;
    case "resultado":
      return <ResultadoCard tarea={tarea} />;
    case "admin-resultado":
      return <AdminResultadoRow tarea={tarea} />;
    case "admin-inscripcion":
      return <AdminInscripcionRow tarea={tarea} onResuelta={onResuelta} />;
  }
};

/* ---------------- Lista acotada ---------------- */

export const SubtituloGrupo = ({ children, count }: { children: ReactNode; count: number }) => (
  <span className="flex items-center gap-2 px-0.5 pt-1.5 pb-0.5 text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase">
    {children}
    <span className="text-foreground-soft">{count}</span>
  </span>
);

/**
 * Contenedor de tareas acotado (≈380 px): scroll interno, desvanecimiento inferior
 * y «Desliza para ver más» solo cuando desborda.
 */
export const ListaTareas = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [desborda, setDesborda] = useState(false);
  const [alFinal, setAlFinal] = useState(false);

  const medir = () => {
    const el = ref.current;
    if (!el) return;
    const overflow = el.scrollHeight > el.clientHeight + 1;
    setDesborda(overflow);
    setAlFinal(!overflow || el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  };

  useLayoutEffect(medir, [children]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mostrarFade = desborda && !alFinal;

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={medir}
        className={cn(
          "flex max-h-[380px] flex-col gap-2 overflow-y-auto overscroll-contain",
          mostrarFade && "pb-7 [mask-image:linear-gradient(180deg,#000_82%,transparent)]"
        )}
      >
        {children}
      </div>
      {mostrarFade && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0.5 bottom-0 text-[11px] font-semibold text-muted-foreground"
        >
          Desliza para ver más
        </span>
      )}
    </div>
  );
};
