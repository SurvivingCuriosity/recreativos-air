import { useParams } from "react-router";
import { useAppSelector } from "../../shared/store/hooks";
import { NavDetalleLiga } from "./NavDetalleLiga";

export const DetalleLigaPage = () => {
  const params = useParams();
  const idLiga = params.id;

  const liga = useAppSelector((state) =>
    state.ligas.ligas.find((l) => l.id === idLiga)
  );

  return (
    <div className="max-w-screen-sm mx-auto p-4 h-full">
      <h1 className="font-cool text-2xl font-bold text-primary">
        {liga?.nombre}
      </h1>
      <NavDetalleLiga />
    </div>
  );
};
