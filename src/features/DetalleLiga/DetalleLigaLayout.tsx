import { Outlet, useParams } from "react-router";
import { useAppSelector } from "../../shared/store/hooks";
import { NavDetalleLiga } from "./NavDetalleLiga";
import { DetalleLigaContext } from "./context/DetalleLigaContext";

export const DetalleLigaLayout = () => {
  const params = useParams();
  const idLiga = params.id;

  const liga = useAppSelector((state) =>
    state.ligas.ligas.find((l) => l.id === idLiga)
  );

  return (
    <DetalleLigaContext.Provider value={{ liga, setLiga: () => {} }}>
      <div className="max-w-screen-sm mx-auto p-4 pt-0 h-full overflow-y-auto">
        <h1 className="sticky top-0 bg-neutral-950 mt-2 z-2 font-cool text-2xl font-bold text-primary animate-fade-in-top ">
          {liga?.nombre}
        </h1>
        <NavDetalleLiga />
        <Outlet />
      </div>
    </DetalleLigaContext.Provider>
  );
};
