import { useQuery } from "@tanstack/react-query";
import { getEquipoById } from "../api";
import type { EquipoDTO } from "recreativos-air-core/equipos";

export const useGetEquipoById = (id: string) => {
  return useQuery({
    queryKey: ["equipos", id],
    queryFn: async (): Promise<EquipoDTO> => {
      const res = await getEquipoById(id);
      return res.data
    },
    enabled: !!id,
  });
};
