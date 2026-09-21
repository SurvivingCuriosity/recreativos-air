import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import { cn } from "@/lib/utils";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useEnfrentamientoById } from "../../../shared/api/enfrentamientos/hooks";
import { useLigaById } from "../../../shared/api/ligas/useLigas";
import { EscudoEquipo } from "../../../shared/components/EscudoEquipo/EscudoEquipo";
import { EstadoError, SkeletonLista } from "../../../shared/components/Estados/Estados";
import { equiposDelUsuarioEnEnfrentamiento } from "../../../shared/components/TarjetaEnfrentamiento/estadoEnfrentamiento";
import { BotonesAdmin } from "./components/BotonesAdmin";
import { BotonesUser } from "./components/BotonesUsers";
import { FechaYLugarEnfrentamiento } from "./components/FechaYLugarEnfrentamiento";
import { InfoEstadoEnfrentamiento } from "./components/InfoEstadoEnfrentamiento";
import { ResultadoEnfrentamiento } from "./components/ResultadoEnfrentamiento";

/** Nombre de equipo enlazado a /equipos/:id (DESIGN.md §6.6). */
const EnlaceEquipo = ({
  equipo,
  mio,
  align,
}: {
  equipo: EquipoDTO;
  mio: boolean;
  align: "left" | "right";
}) => (
  <Link
    to={`/equipos/${equipo.id}`}
    className={cn(
      "flex min-h-11 items-center gap-2.5 truncate font-display text-[22px] font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      align === "right" && "flex-row-reverse text-right",
      mio ? "text-primary-text text-glow-liga" : "text-foreground"
    )}
  >
    <EscudoEquipo nombre={equipo.nombre} color={equipo.color} size={40} />
    <span className="truncate">{equipo.nombre}</span>
  </Link>
);

export const DetalleJornadaPage = () => {
  const { id: idEnfrentamiento } = useParams();
  const { user } = useAuth();
  const { data: enfrentamiento, isLoading } = useEnfrentamientoById(idEnfrentamiento || "");
  const { data: liga } = useLigaById(enfrentamiento?.idLiga || "");

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-screen-sm px-4 pt-2">
        <SkeletonLista count={4} height="h-14" label="Cargando liga..." />
      </main>
    );
  }
  if (enfrentamiento === undefined) {
    return <EstadoError className="p-10">Ups...Esta liga ya no existe</EstadoError>;
  }

  const misEquipos = equiposDelUsuarioEnEnfrentamiento(enfrentamiento, user?.id);

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-3.5 px-4 pt-2 pb-5">
      {/* Miga «← {liga}» (DESIGN.md §6.6) */}
      <Link
        to={`/competiciones/${enfrentamiento.idLiga}/jornadas`}
        className="inline-flex min-h-11 items-center gap-1 self-start font-semibold text-foreground-soft hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ChevronLeft size={18} aria-hidden="true" />
        <span>{liga?.nombre ?? "Volver a la liga"}</span>
      </Link>

      <div className="relative flex flex-col gap-7">
        <EnlaceEquipo
          equipo={enfrentamiento.equipoA}
          mio={misEquipos.includes(enfrentamiento.equipoA.id)}
          align="left"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[40px] font-bold text-input"
        >
          vs
        </span>
        <EnlaceEquipo
          equipo={enfrentamiento.equipoB}
          mio={misEquipos.includes(enfrentamiento.equipoB.id)}
          align="right"
        />
      </div>

      <FechaYLugarEnfrentamiento enfrentamiento={enfrentamiento} />

      <InfoEstadoEnfrentamiento enfrentamiento={enfrentamiento} />

      <ResultadoEnfrentamiento enfrentamiento={enfrentamiento} cfgLiga={liga?.configuracion} />

      <BotonesUser enfrentamiento={enfrentamiento} />

      <BotonesAdmin enfrentamiento={enfrentamiento} />
    </main>
  );
};
