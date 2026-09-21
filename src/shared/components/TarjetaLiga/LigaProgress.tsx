import { EstadoEnfrentamiento } from "recreativos-air-core/enfrentamiento";
import { useAuth } from "../../api/auth/useAuth";
import { useEnfrentamientosLiga } from "../../api/enfrentamientos/hooks";
import { ProgressBar } from "../ProgressBar/ProgressBar";

export const LigaProgress = ({
  ligaId,
  myTeamId,
}: {
  ligaId: string;
  myTeamId?: string;
}) => {
  const { user } = useAuth();
  const { data: enfrentamientos = [] } = useEnfrentamientosLiga(ligaId);

  if (enfrentamientos.length === 0) return null;

  const totalPartidos = enfrentamientos.length;
  const partidosJugados = enfrentamientos.filter(
    (e) => e.estado === EstadoEnfrentamiento.Jugado
  ).length;
  const porcentajeLiga = (partidosJugados / totalPartidos) * 100;

  const misEnfrentamientos = myTeamId
    ? enfrentamientos.filter(
        (e) => e.equipoA.id === myTeamId || e.equipoB.id === myTeamId
      )
    : [];

  const totalMisPartidos = misEnfrentamientos.length;
  const misPartidosJugados = misEnfrentamientos.filter(
    (e) => e.estado === EstadoEnfrentamiento.Jugado
  ).length;

  const porcentajePersonal =
    totalMisPartidos > 0 ? (misPartidosJugados / totalMisPartidos) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-2 pr-2">
      {user?.admin && <ProgressBar progress={porcentajeLiga} label="Liga" />}
      {myTeamId && totalMisPartidos > 0 && (
        <ProgressBar progress={porcentajePersonal} label="Has jugado" />
      )}
    </div>
  );
};
