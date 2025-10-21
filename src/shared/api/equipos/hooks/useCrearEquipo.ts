import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { crearEquipo } from "../api";
import type { CrearEquipoBody, EquipoDTO } from "recreativos-air-core/equipos";

export const useCrearEquipo = () => {
  return useMutation({
    mutationFn: (payload: CrearEquipoBody) => crearEquipo(payload),
    onSuccess: (res) => {
      const equipo: EquipoDTO = res.data
      toast.success(`Equipo "${equipo.nombre}" creado correctamente`);
    },
    onError: () => toast.error("Error al crear el equipo"),
  });
};
