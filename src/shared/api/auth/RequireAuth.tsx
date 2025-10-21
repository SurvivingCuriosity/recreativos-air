import type { FC, ReactNode } from "react";
import { Navigate } from "react-router";
import { useMe } from "./hooks";
import { FullPageSpinner } from "../../../packages/components/FullPageSpinner/FullPageSpinner";

export const RequireAuth: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: me, isLoading } = useMe();
  if (isLoading) return <FullPageSpinner />;       // Suspense tb vale
  return me ? <>{children}</> : <Navigate to="/login" />;
};