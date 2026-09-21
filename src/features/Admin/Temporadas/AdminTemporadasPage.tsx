import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useTemporadas } from "../../../shared/api/temporadas/useTemporadas";
import { EstadoVacio, SkeletonLista } from "../../../shared/components/Estados/Estados";
import { PageTitle } from "../../../shared/components/Titulos/Titulos";
import { TarjetaTemporadaAdmin } from "./TarjetaTemporadaAdmin";

export const AdminTemporadasPage = () => {
  const navigate = useNavigate();
  const { data: temporadas, isLoading } = useTemporadas();

  return (
    <main className="mx-auto flex w-full max-w-screen-sm flex-col gap-3 px-4 pt-[18px] pb-5">
      <title>Temporadas | Recreativos Air</title>
      <PageTitle color="primary" className="text-2xl">
        Temporadas
      </PageTitle>
      <Button onClick={() => navigate("/admin-temporadas/nueva")} icon={Plus}>
        Nueva temporada
      </Button>

      {isLoading ? (
        <SkeletonLista count={2} height="h-20" label="Cargando temporadas..." />
      ) : !temporadas?.length ? (
        <EstadoVacio className="mt-6 border-0 bg-transparent">No hay temporadas</EstadoVacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {temporadas.map((t) => (
            <li key={t.id}>
              <TarjetaTemporadaAdmin
                temporada={t}
                onClick={() => navigate(`/admin-temporadas/${t.id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};
