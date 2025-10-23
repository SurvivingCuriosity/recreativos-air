import { useQuery } from "@tanstack/react-query";
import type { EquipoDTO } from "recreativos-air-core/equipos";
import { getAllEquipos, getEquiposUsuario } from "../api";

export const useGetEquiposUsuario = (userId: string) =>
  useQuery({
    queryKey: ["equipos", userId],
    queryFn: async (): Promise<EquipoDTO[]> => {
      const res = await getEquiposUsuario(userId);
      return res.data;
    },
    enabled: !!userId,
  });

export const useGetAllEquipos = () => {
  return useQuery({
    queryKey: ["equipos"],
    queryFn: async (): Promise<EquipoDTO[]> => {
      const res = await getAllEquipos();
      return res.data;
    },
  });
};
