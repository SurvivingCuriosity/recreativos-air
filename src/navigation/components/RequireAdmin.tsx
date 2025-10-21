import { Navigate, Outlet } from "react-router";
import { useMe } from "../../shared/api/auth/hooks";
import { FullPageSpinner } from "../../packages/components/FullPageSpinner/FullPageSpinner";

export default function RequireAdmin() {
  const { data: me, isLoading } = useMe();

  const isAdmin = me?.admin

  if (isLoading) return <FullPageSpinner />;

  return isAdmin
    ? <Outlet />
    : <Navigate to="/" replace />;
}
