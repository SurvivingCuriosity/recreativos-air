import { useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../../packages/components/Button/Button";
import { useAuth } from "../../../shared/api/auth/useAuth";
import { useLigaById } from "../../../shared/api/ligas/useLigas";
import { useWindow } from "../../../shared/context/WindowProvider";
import { InscribirEquipoExistenteForm } from "../components/InscribirEquipoExistenteForm";
import { TarjetaEquipoLiga } from "../components/TarjetaEquipoLiga";
import { EstadoEquipoEnLiga } from "recreativos-air-core/liga";

export const EquiposLigaPage = () => {
  const navigate = useNavigate();

  const { id: idLiga } = useParams();
  const { data: liga } = useLigaById(idLiga || "");

  const { user } = useAuth();
  const { show, close } = useWindow();

  const handleInscribirEquipoExistente = () => {
    if (!liga) {
      toast.error("Error al cargar liga");
      return;
    }

    show(
      <InscribirEquipoExistenteForm onCloseWindow={close} idLiga={liga.id} />,
      "Elige un equipo"
    );
  };

  const equiposShow = useMemo(
    () =>
      user?.admin
        ? liga?.equipos || []
        : liga?.equipos.filter(
            (e) => e.estado === EstadoEquipoEnLiga.Aprobado
          ) || [],
    [liga, user]
  );

  if (!liga) return <p>Ups algo pasó</p>;

  return (
    <>
      {user?.admin && (
        <div className="mb-3">
          <Button
            onClick={handleInscribirEquipoExistente}
            variant="outline-neutral"
          >
            Inscribir equipo exitente
          </Button>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {equiposShow.length > 0 ? (
          equiposShow.map((equipo, index) => (
            <TarjetaEquipoLiga
              key={index}
              idLiga={liga.id}
              equipoLiga={equipo}
              onClick={() => navigate(`/equipos/${equipo.equipo.id}`)}
            />
          ))
        ) : (
          <p className="text-neutral-400 p-4 text-center">
            Ups... no hay equipos aún
          </p>
        )}
      </ul>
    </>
  );
};
