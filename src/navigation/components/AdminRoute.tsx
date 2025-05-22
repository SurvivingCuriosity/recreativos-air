import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../shared/store/hooks";
import { selectIsAuthenticated } from "../../shared/store/slices/authSlice";

export default function AdminRoute() {
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const { user } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();

  return isLoggedIn && user?.admin ? (
    <Outlet />
  ) : (
    <Navigate to="/competiciones" replace state={{ from: pathname }} />
  );
}
