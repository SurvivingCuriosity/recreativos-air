import { MapPin, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { useParams } from "react-router";
import { cn } from "@/lib/utils";
import { useLigaById } from "../../../shared/api/ligas/useLigas";

const Bloque = ({
  titulo,
  icon,
  tono = "neutral",
  children,
}: {
  titulo: string;
  icon?: ReactNode;
  tono?: "neutral" | "warning";
  children: ReactNode;
}) => (
  <section
    className={cn(
      "flex flex-col gap-2 rounded-card border bg-card p-3.5",
      tono === "warning" ? "border-warning/35" : "border-border"
    )}
  >
    <h2
      className={cn(
        "inline-flex items-center gap-2 font-display text-base font-bold tracking-[0.1em] uppercase",
        tono === "warning" ? "text-warning" : "text-foreground-soft"
      )}
    >
      {icon}
      {titulo}
    </h2>
    {children}
  </section>
);

/** Información de la liga (design/screens/LigaInfo.html). */
export const InfoLigaPage = () => {
  const { id: idLiga } = useParams();
  const { data: liga } = useLigaById(idLiga || "");

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-sm leading-[1.55] whitespace-pre-wrap text-foreground-soft">
        {liga?.descripcion || "Sin información disponible"}
      </p>

      {liga?.normas && (
        <Bloque titulo="Normas">
          <p className="text-sm leading-[1.55] whitespace-pre-wrap text-foreground-soft">
            {liga.normas}
          </p>
        </Bloque>
      )}

      {liga?.ubicaciones && liga.ubicaciones.length > 0 && (
        <Bloque titulo="Ubicaciones">
          {liga.ubicaciones.map((ubicacion, index) => (
            <span key={index} className="inline-flex items-center gap-2 text-sm text-foreground-soft">
              <MapPin size={16} className="shrink-0" aria-hidden="true" />
              <span>{ubicacion}</span>
            </span>
          ))}
        </Bloque>
      )}

      {liga?.premio && (
        <Bloque titulo="Premio" tono="warning" icon={<Trophy size={16} aria-hidden="true" />}>
          <p className="text-sm leading-[1.55] whitespace-pre-wrap text-foreground-soft">
            {liga.premio}
          </p>
        </Bloque>
      )}
    </div>
  );
};
