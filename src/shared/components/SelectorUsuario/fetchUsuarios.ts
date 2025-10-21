import type { SearchUserDTO } from "recreativos-air-core/user";
import api from "../../api/http";
import type { ApiResponse } from "../../api/types";
import type { UserEnSelector } from "./SelectorUsuario";

type fetchUsersResponse = Array<SearchUserDTO>;

export const fetchUsers = async (
  input: string | number
): Promise<UserEnSelector[]> => {
  // evita llamadas vacías
  if (!input) return [];

  const controller = new AbortController();

  const { data } = await api.get<ApiResponse<fetchUsersResponse>>(
    "/users/buscar",
    {
      params: { q: input, limit: 10 },
      signal: controller.signal,
    }
  );

  const users = data.data;

  return users.map((u: SearchUserDTO) => ({
    ...u,
    value: u.id,
    label: u.username,
  }));
};
