import { Navigate, Outlet, useLocation } from "react-router";
import { useMe } from "../../shared/api/auth/hooks";
import { FullPageSpinner } from "../../packages/components/FullPageSpinner/FullPageSpinner";
import { Suspense } from "react";

export default function RequireAuth() {
  const location   = useLocation();
  const { data: me, isLoading, isError } = useMe();

  // a) indicador de carga (mejor dentro de <Suspense>)
  if (isLoading) return <FullPageSpinner />;

  // b) sin sesión ó error 401 → redirige
  if (isError || !me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // c) usuario autenticado → muestra la ruta hija
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Outlet />
    </Suspense>
  );
}
