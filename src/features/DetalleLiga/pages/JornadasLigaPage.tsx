import { use, useState } from "react";
import { useNavigate } from "react-router";
import { TarjetaEnfrentamiento } from "../../../shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento";
import { EstadoEnfrentamientoOpcionCualquiera } from "../../../shared/enum/EstadoEnfrentamiento";
import type { Enfrentamiento } from "../../../shared/interfaces/Enfrentamiento";
import { FiltrosJornadas } from "../components/FiltrosJornadas";
import { DetalleLigaContext } from "../context/DetalleLigaContext";

export const JornadasLigaPage = () => {
  const navigate = useNavigate();

  const [idEnfrentamientoOpen, setIdEnfrentamientoOpen] = useState<
    number | null
  >(null);

  const { liga } = use(DetalleLigaContext);

  const [enfrentamientosFiltrados, setEnfrentamientosFiltrados] = useState<
    Enfrentamiento[]
  >(liga.enfrentamientos);

  const handleFilterEquipos = (idEquipo: string | null) => {
    const filtered =
      idEquipo === "-1"
        ? liga.enfrentamientos
        : liga.enfrentamientos.filter(
            (e) => e.equipoA.id === idEquipo || e.equipoB.id === idEquipo
          );
          console.log(filtered)
    setEnfrentamientosFiltrados(filtered);
  };

  const handleFilterEstado = (
    estadoEnfrentamiento: EstadoEnfrentamientoOpcionCualquiera
  ) => {
    setEnfrentamientosFiltrados(
      estadoEnfrentamiento === EstadoEnfrentamientoOpcionCualquiera.Cualquiera
        ? liga.enfrentamientos
        : liga.enfrentamientos.filter((e) => e.estado === estadoEnfrentamiento)
    );
  };

  console.log(enfrentamientosFiltrados)

  return (
    <div className="flex flex-col gap-3 pb-20">
      <FiltrosJornadas
        onChangeEquipos={handleFilterEquipos}
        onChangeEstado={handleFilterEstado}
      />
      {enfrentamientosFiltrados.length === 0 ? (
        <p className="text-center p-10">Sin resultados</p>
      ) : (
        enfrentamientosFiltrados.map((enfrentamiento) => (
          <TarjetaEnfrentamiento
            key={enfrentamiento.id}
            enfrentamiento={enfrentamiento}
            optionsOpen={idEnfrentamientoOpen === enfrentamiento.id}
            onOptionsClick={setIdEnfrentamientoOpen}
            onClick={() =>
              navigate("/jornadas/" + enfrentamiento.id, {
                state: {
                  enfrentamiento,
                },
              })
            }
          />
        ))
      )}
    </div>
  );
};
