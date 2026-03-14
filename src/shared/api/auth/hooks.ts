import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ForgotPasswordBody,
  type LoginBody,
  type RegisterBody,
  type ResetPasswordBody,
  type VerifyEmailBody,
} from "recreativos-air-core/auth";
import type { UserDTO } from "recreativos-air-core/user";
import api from "../http";
import { clearAccessToken, setAccessToken } from "./authStorage";
import type { ApiResponse, AuthPayload } from "./types";

export const useRegister = () =>
  useMutation({
    mutationFn: async (payload: RegisterBody): Promise<ApiResponse<null>> => {
      const { data } = await api.post<ApiResponse<null>>(
        "/auth/register",
        payload
      );
      return data;
    },
  });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: async (
      payload: VerifyEmailBody
    ): Promise<ApiResponse<AuthPayload>> => {
      const { data } = await api.post<ApiResponse<AuthPayload>>(
        "/auth/verify-email",
        payload
      );
      if (data.data?.token) setAccessToken(data.data.token);
      return data;
    },
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async (
      payload: LoginBody
    ): Promise<ApiResponse<AuthPayload>> => {
      const { data } = await api.post<ApiResponse<AuthPayload>>(
        "/auth/login",
        payload
      );
      if (data.data?.token) setAccessToken(data.data.token);
      return data;
    },
  });

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    enabled,
    queryFn: async (): Promise<UserDTO> => {
      const { data } = await api.get("/auth/me");
      return data.data;
    },
  });
}

export const useForgotPassword = () =>
  useMutation({
    mutationFn: async (payload: ForgotPasswordBody): Promise<ApiResponse<null>> => {
      const { data } = await api.post<ApiResponse<null>>(
        "/auth/forgot-password",
        payload
      );
      return data;
    },
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: async (payload: ResetPasswordBody): Promise<ApiResponse<null>> => {
      const { data } = await api.post<ApiResponse<null>>(
        "/auth/reset-password",
        payload
      );
      return data;
    },
  });

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    clearAccessToken();
    queryClient.removeQueries({ queryKey: ["me"] });
  };
};
