import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { UpdateUserBody } from "recreativos-air-core/user";
import type { ErrorResponse } from "../http";
import { UserApi } from "./api";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => UserApi.getAll(),
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserBody) => UserApi.updateMe(data),
    onSuccess: () => {
      toast.success("Perfil actualizado");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error: ErrorResponse) =>
      toast.error(error.message || "Error al actualizar el perfil"),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserApi.getUserById(id),
    enabled: !!id,
  });
};
