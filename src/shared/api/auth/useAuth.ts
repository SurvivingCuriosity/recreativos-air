import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "./authStorage";
import { useMe } from "./hooks";
import type { User } from "../auth/types";

export function useAuth() {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData<User>(["me"]);

  const { data: user, isFetching } = useMe(!cachedUser && !!getAccessToken());

  return {
    user: user ?? cachedUser ?? null,
    isLoggedIn: !!(user ?? cachedUser),
    isLoading: isFetching && !user,
  };
}
