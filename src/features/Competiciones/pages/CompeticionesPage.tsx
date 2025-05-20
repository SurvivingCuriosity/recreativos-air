import { TarjetaLiga } from "../../../shared/components/TarjetaLiga/TarjetaLiga";
import { useAppDispatch, useAppSelector } from "../../../shared/store/hooks";
import { logout } from "../../../shared/store/slices/authSlice";

export const CompeticionesPage = () => {
  const { ligas } = useAppSelector((state) => state.ligas);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      {ligas.length === 0 ? (
        <p>No hay ligas</p>
      ) : (
        <ul className="flex flex-col gap-4 w-full">
          {ligas.map((liga) => (
            <TarjetaLiga key={liga.id} liga={liga} />
          ))}
        </ul>
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
