import { Outlet } from "react-router";
import { TopNav, type TopNavItem } from "../../navigation/components/TopNav";

const TopNavContent: TopNavItem[] = [
  { label: "Mi perfil", href: "/mi-perfil" },
  { label: "Competiciones", href: "/competiciones" },
];

export const CompeticionesLayout = () => {

  return (
    <div className="bg-neutral-950 text-neutral-50 h-svh">
      <TopNav content={TopNavContent}/>
      <div className="pt-14 h-full relative max-w-screen-lg mx-auto">
        <img src='logo.png' alt='logo' className='w-full opacity-[4%] pointer-events-none fixed -bottom-1/12 left-1/3' />
        <Outlet />
      </div>
    </div>
  );
};
