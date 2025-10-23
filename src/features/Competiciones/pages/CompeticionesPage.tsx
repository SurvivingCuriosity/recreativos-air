import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { Message } from "../../../packages/components/Message/Message";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useGetEquiposUsuario } from "../../../shared/api/equipos/hooks/useGetEquipos";
import { useLigas } from "../../../shared/api/ligas/useLigas";
import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";

export const CompeticionesPage = () => {
  const navigate = useNavigate();

  const { data: ligas, isLoading, error } = useLigas();

  const { user } = useAuth();
  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");

  return (
    <>
      <title>Competiciones | Recreativos Air</title>
      <div className="max-w-screen-md mx-auto flex flex-col items-center justify-start p-4 h-full gap-3">
        <h1 className="text-3xl font-bold font-cool sticky top-0 bg-neutral-950 pb-2 w-full">Competiciones</h1>
        {equiposUsuario?.length === 0 && (
          <Message variant="info" className="w-full mb-2">
            <>
              <p>
                No perteneces a ningún equipo. Debes crear un equipo para poder
                inscribirte a las competiciones
              </p>
              <Link
                to="/crear-equipo"
                className="text-primary underline text-sm"
              >
                Crear equipo
              </Link>
            </>
          </Message>
        )}
        {user?.admin && (
          <Button onClick={() => navigate("/crear-liga")} icon={faTrophy}>
            Nueva liga
          </Button>
        )}
        {isLoading && <p>Cargando...</p>}
        {error && <p>Error al cargar {String(error)}</p>}

        {ligas?.length === 0 ? (
          <p className="text-center p-10 text-neutral-400">No hay ligas</p>
        ) : (
          <ul className="flex flex-row flex-wrap gap-4 w-full h-11/12 overflow-y-auto pt-2 justify-center">
            {ligas?.map((liga, index) => (
              <span
                style={{ animationDelay: `${index * 0.1}s` }}
                key={liga.id}
                className="animate-fade-in-top"
              >
                <TarjetaLiga
                  liga={liga}
                  onClick={() =>
                    navigate(`/competiciones/${liga.id}/clasificacion`)
                  }
                />
              </span>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
