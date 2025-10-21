import type { LigaDTO } from "recreativos-air-core/liga";
import { useAuth } from "../api/auth/useAuth";

export const useIsInscritoALiga = (liga: LigaDTO) => {
  const { user } = useAuth();

  const userYaInscrito = liga.equipos?.some((e) =>
    e.equipo.jugadores?.some((j) => j.idUsuario === user?.id)
  );

  return userYaInscrito;
};
