import { Outlet } from "react-router";
import { TopNav, type TopNavItem } from "../../navigation/components/TopNav";

const TopNavContent: TopNavItem[] = [
  { label: "Seccion 1", href: "#seccion1" },
  { label: "Seccion 1", href: "#seccion1" },
  { label: "Seccion 1", href: "#seccion1" },
  { label: "Seccion 1", href: "#seccion1" },
];

export const MainLayout = () => {
  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-svh">
      <TopNav content={TopNavContent} />
      <div className="pt-14 h-full relative mx-auto">
        <img
          src="/logo.png"
          alt="logo"
          className="w-full opacity-[4%] pointer-events-none fixed z-0 -bottom-1/12 left-1/3"
        />
        <div className="z-1 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
