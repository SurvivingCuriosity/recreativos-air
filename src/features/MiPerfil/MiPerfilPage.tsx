import { faPlus, faTrophy, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Button } from "../../packages/components/Button/Button";
import { Titulo } from "../../packages/components/Titulo/Titulo";
import { useLogout } from "../../shared/api/auth/hooks";
import { useAuth } from "../../shared/api/auth/useAuth";
import { MisCompeticiones } from "./components/MisCompeticiones";
import { MisEquipos } from "./components/MisEquipos";

export const MiPerfilPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login", { replace: true });
  };

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <title>Mi perfil | Recreativos Air</title>
      <div className="max-w-screen-md mx-auto p-3 flex flex-col gap-4 justify-start h-full">
        <div className="flex justify-between bg-neutral-900 rounded-xl relative p-3">
          <span>
            <Titulo variant="h2" className="font-cool">
              {user?.username}
            </Titulo>

            <p className="text-neutral-500">{user?.nombre}</p>
            <p className="text-neutral-500">{user?.email}</p>
            <p className="text-neutral-500">{user?.movil}</p>
          </span>
          <button
            onClick={handleLogout}
            className="rounded-lg text-red-600 bg-neutral-950 border border-red-600 px-3 py-1 mt-auto z-1"
          >
            Salir
          </button>
          {user?.admin && (
            <p className="absolute -top-2 -left-2 bg-primary text-black text-xs size-min p-0.5 px-2 rounded-md font-bold">
              ADMIN
            </p>
          )}
        </div>

        {/* Equipos */}
        <div className="p-3 rounded-xl">
          <div className="flex items-center gap-2 pb-2">
            <FontAwesomeIcon
              icon={faUsers}
              className="text-neutral-300"
              size="lg"
            />
            <Titulo
              variant="h4"
              className="font-cool text-neutral-300! tracking-widest"
            >
              Equipos
            </Titulo>
            <div className="w-min ml-auto">
              <Button
                onClick={() => navigate("/crear-equipo")}
                variant="outline-neutral"
                icon={faPlus}
              >
                <></>
              </Button>
            </div>
          </div>

          <MisEquipos idUsuario={user?.id || ""} />
        </div>

        {/* Competiciones */}
        <div className="p-3 rounded-xl">
          <div className="flex items-center gap-2 pb-2">
            <FontAwesomeIcon
              icon={faTrophy}
              className="text-neutral-300"
              size="lg"
            />
            <Titulo
              variant="h4"
              className="font-cool text-neutral-300! tracking-widest"
            >
              Competiciones
            </Titulo>
            {user?.admin && (
              <div className="w-min ml-auto">
                <Button
                  onClick={() => navigate("/crear-liga")}
                  variant="outline-neutral"
                  icon={faPlus}
                >
                  <></>
                </Button>
              </div>
            )}
          </div>
          <MisCompeticiones />
        </div>
      </div>
    </>
  );
};
