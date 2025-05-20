import {
  faFutbol,
  faPeopleGroup,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fab from "../../../packages/components/FAB/FAB";
import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";
import { useAppDispatch, useAppSelector } from "../../../shared/store/hooks";
import { logout } from "../../../shared/store/slices/authSlice";

export const CompeticionesPage = () => {
  const { ligas } = useAppSelector((state) => state.ligas);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-start p-4 h-full">
      {ligas.length === 0 ? (
        <p>No hay ligas</p>
      ) : (
        <ul className="flex flex-col gap-4 w-full">
          {ligas.map((liga) => (
            <TarjetaLiga key={liga.id} liga={liga} />
          ))}
        </ul>
      )}
      {user?.admin && (
        <Fab
          items={[
            {
              label: "Nueva liga",
              icon: <FontAwesomeIcon icon={faTrophy} />,
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
      <button
        onClick={() => dispatch(logout())}
        className="rounded bg-red-600 text-white px-3 py-1 mt-auto"
      >
        Cerrar sesión
      </button>
    </div>
  );
};
