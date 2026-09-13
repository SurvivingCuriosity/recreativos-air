import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useTemporadas } from "../../../shared/api/temporadas/useTemporadas";
import { TarjetaTemporadaAdmin } from "./TarjetaTemporadaAdmin";

export const AdminTemporadasPage = () => {
  const navigate = useNavigate();
  const { data: temporadas, isLoading } = useTemporadas();

  if (isLoading)
    return (
      <p className="text-center text-neutral-400 p-6 animate-pulse">
        Cargando temporadas...
      </p>
    );

  return (
    <div className="p-3 max-w-screen-sm mx-auto w-full">
      <title>Temporadas | Recreativos Air</title>
      <div className="sticky top-0 z-10 bg-neutral-950 pb-2">
        <h1 className="font-cool text-2xl text-primary">Temporadas</h1>
        <div className="mt-2">
          <Button
            onClick={() => navigate("/admin-temporadas/nueva")}
            icon={faPlus}
          >
            Nueva temporada
          </Button>
        </div>
      </div>

      {!temporadas?.length ? (
        <p className="text-center text-neutral-500 mt-10">No hay temporadas</p>
      ) : (
        <ul className="space-y-3 mt-3">
          {temporadas.map((t) => (
            <TarjetaTemporadaAdmin
              key={t.id}
              temporada={t}
              onClick={() => navigate(`/admin-temporadas/${t.id}`)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
