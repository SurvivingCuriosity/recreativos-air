import { Outlet } from "react-router";
import { TopNav } from "../../navigation/components/TopNav";

export const MainLayout = () => {
  return (
    <div className="bg-neutral-950 text-neutral-50 h-svh">
      <TopNav />
      <Outlet />
    </div>
  );
};
