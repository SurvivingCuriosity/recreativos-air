import { Outlet } from "react-router";
import { TopNav } from "../../navigation/components/TopNav";
export const MainLayout = () => {
  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-svh">
      <TopNav />
      <div className="pt-14 h-full relative mx-auto">
        <img src='logo.png' alt='logo' className='w-full opacity-[4%] pointer-events-none fixed z-0 -bottom-1/12 left-1/3' />
        <div className="z-1 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
