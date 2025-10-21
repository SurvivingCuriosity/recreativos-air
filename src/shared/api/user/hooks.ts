import { useQuery } from "@tanstack/react-query";
import { UserApi } from "./api";

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserApi.getUserById(id),
    enabled: !!id,
  });
};
