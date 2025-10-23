import { useQuery } from "@tanstack/react-query";
import { UserApi } from "./api";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => UserApi.getAll(),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserApi.getUserById(id),
    enabled: !!id,
  });
};
