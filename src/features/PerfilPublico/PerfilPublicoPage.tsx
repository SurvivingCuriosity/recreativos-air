import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { useAuth } from "../../shared/api/auth/useAuth";
import { useGetEquiposUsuario } from "../../shared/api/equipos/hooks/useGetEquipos";
import { useLigas } from "../../shared/api/ligas/useLigas";
import { useGetUserById } from "../../shared/api/user/hooks";
import { TarjetaEquipo } from "../../shared/components/TarjetaEquipo/TarjetaEquipo";
import { TarjetaLiga } from "../../shared/components/TarjetaLiga/TarjetaLiga";
import { ButtonWhatsapp2 } from "../LandingPage/ButtonWhatsapp";

export const PerfilPublicoPage = () => {
  const { id } = useParams();

  const { user: loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.admin;

  const { data: user } = useGetUserById(id || "");

  const { data: equiposUsuario } = useGetEquiposUsuario(user?.id || "");

  const { data: ligas } = useLigas();

  const ligasEnLasQueEstaInscrito = ligas?.filter((l) =>
    l.equipos.some((e) =>
      e.equipo.jugadores.some((j) => j.idUsuario === user?.id)
    )
  );

  const navigate = useNavigate();

  const handleNavigateLiga = (idLiga: string) => {
    navigate(`/competiciones/${idLiga}/clasificacion`);
  };

  if (
    user !== undefined &&
    loggedInUser !== undefined &&
    loggedInUser?.id === user.id
  ) {
    return <Navigate to="/mi-perfil" />;
  }

  return (
    <div className="p-4 flex flex-col gap-4 justify-start h-full">
      <div className="flex justify-between relative p-3 rounded-xl bg-neutral-900">
        <span>
          <Titulo variant="h2" className="font-cool">
            {user?.username}
          </Titulo>
          <p className="text-neutral-500">{user?.nombre}</p>
          {isAdmin && (
            <div className="flex items-center gap-2 text-neutral-500">
              <FontAwesomeIcon icon={faPhone} />
              <p>{user?.movil}</p>
            </div>
          )}
          {isAdmin && (
            <div className="flex items-center gap-2 text-neutral-500">
              <FontAwesomeIcon icon={faEnvelope} />
              <p>{user?.email}</p>
            </div>
          )}
          {isAdmin && user?.movil && (
            <div className="absolute top-1 right-2">
              <ButtonWhatsapp2 numero={user.movil} />
            </div>
          )}
        </span>
        {user?.admin && (
          <p className="text-primary text-xs absolute top-2 right-2">ADMIN</p>
        )}
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:gap-3">
        <div className="my-2 md:bg-neutral-900/80 rounded-xl md:p-6 grow">
          <Titulo
            variant="h4"
            className="font-cool text-neutral-300! tracking-widest underline underline-offset-2 mb-4"
          >
            Equipos
          </Titulo>
          {equiposUsuario && equiposUsuario?.length > 0 ? (
            <div className="flex items-center overflow-x-auto gap-2">
              {equiposUsuario?.map((equipo, index) => (
                <TarjetaEquipo
                  key={index}
                  equipo={equipo}
                  onClick={() => navigate(`/equipos/${equipo.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-neutral-500 p-4 text-center">
              <p>No tiene equipos</p>
            </div>
          )}
        </div>

        <div className="my-2 md:bg-neutral-900/80 rounded-xl md:p-6 grow">
          <Titulo
            variant="h4"
            className="font-cool text-neutral-300! tracking-widest underline underline-offset-2 mb-4"
          >
            Competiciones
          </Titulo>
          {ligasEnLasQueEstaInscrito &&
          ligasEnLasQueEstaInscrito?.length > 0 ? (
            <ul className="pb-3 flex overflow-x-auto gap-4 mt-2 snap-x rounded-lg ">
              {ligasEnLasQueEstaInscrito?.map((l) => (
                <div
                  key={l.id}
                  className="w-[87%] max-w-96 shrink-0 snap-center rounded-xl"
                >
                  <TarjetaLiga
                    key={l.id}
                    liga={l}
                    onClick={() => handleNavigateLiga(l.id)}
                  />
                </div>
              ))}
            </ul>
          ) : (
            <div className="text-neutral-500 p-4 text-center">
              <p>No estas inscrito a ninguna competición</p>
              <Link to="/competiciones" className="text-primary underline">
                Ver competiciones
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
