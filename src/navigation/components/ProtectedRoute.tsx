import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../shared/store/hooks";
import { selectIsAuthenticated } from "../../shared/store/slices/authSlice";

export default function ProtectedRoute() {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { pathname } = useLocation();

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: pathname }} />
  );
}
