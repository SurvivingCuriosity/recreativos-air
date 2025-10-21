import { useQuery } from "@tanstack/react-query";
import { getEquiposUsuario } from "../api";
import type { EquipoDTO } from "recreativos-air-core/equipos";

export const useGetEquiposUsuario = (userId: string) =>
  useQuery({
    queryKey: ["equipos", userId],
    queryFn: async (): Promise<EquipoDTO[]> => {
      const res = await getEquiposUsuario(userId);
      return res.data
    },
    enabled: !!userId,
  });
