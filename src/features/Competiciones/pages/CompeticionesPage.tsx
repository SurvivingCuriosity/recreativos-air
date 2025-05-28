import {
  faFutbol,
  faPeopleGroup,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router";
import Fab from "../../../packages/components/FAB/FAB";
import { Message } from "../../../packages/components/Message/Message";
import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";
import { useAppSelector } from "../../../shared/store/hooks";

export const CompeticionesPage = () => {
  const { ligas } = useAppSelector((state) => state.ligas);
  const navigate = useNavigate();

  const { equiposUsuario } = useAppSelector((state) => state.user);

  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-start p-4 h-full">
      {equiposUsuario.length === 0 && (
        <Message variant="info" className="w-full mb-2">
          <>
            <p>
              No perteneces a ningún equipo. Debes crear un equipo para poder
              inscribirte a las competiciones
            </p>
            <Link to="/crear-equipo" className="text-primary underline text-sm">
              Crear equipo
            </Link>
          </>
        </Message>
      )}

      {ligas.length === 0 ? (
        <p>No hay ligas</p>
      ) : (
        <ul className="flex flex-col gap-4 w-full h-11/12 overflow-y-auto">
          {ligas.map((liga, index) => (
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
      {user?.admin && (
        <Fab
          items={[
            {
              label: "Nueva liga",
              icon: <FontAwesomeIcon icon={faTrophy} />,
              onClick: () => navigate("/crear-liga"),
            },
            {
              label: "Nuevo resultado",
              icon: <FontAwesomeIcon icon={faFutbol} />,
            },
            {
              label: "Nuevo equipo",
              icon: <FontAwesomeIcon icon={faPeopleGroup} />,
            },
          ]}
          showLabels={true}
        />
      )}

    </div>
  );
};
