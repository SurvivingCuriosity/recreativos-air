import { LogOut, Pencil, Plus, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "@/shared/lib/toast";
import { Button } from "../../packages/components/Button/Button";
import { useLogout } from "../../shared/api/auth/hooks";
import { useAuth } from "../../shared/api/auth/useAuth";
import { ChipEstado } from "../../shared/components/ChipEstado/ChipEstado";
import { SectionTitle } from "../../shared/components/Titulos/Titulos";
import { BotonRefrescar } from "../DetalleLiga/DetalleLigaLayout";
import { MisCompeticiones } from "./components/MisCompeticiones";
import { MisEquipos } from "./components/MisEquipos";

/** Botón «+» circular de cabecera de sección (44 px). */
const BotonMas = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button variant="outline-neutral" icon={Plus} onClick={onClick} aria-label={label} />
);

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
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-[22px] px-4 pt-[18px] pb-5 lg:gap-7 lg:px-6 lg:pt-8">
        {/* Cabecera del usuario (design/screens/MiPerfil.html) */}
        <section className="flex items-end justify-between gap-3 rounded-[18px] border border-border bg-card p-3.5 lg:rounded-card-lg lg:p-6">
          <div className="flex min-w-0 flex-col gap-[3px]">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-[28px] leading-none font-bold text-primary-text text-glow-liga lg:text-[34px]">
                {user?.username}
              </h1>
              {user?.admin && <ChipEstado color="primary">ADMIN</ChipEstado>}
            </div>
            <span className="text-foreground-soft">{user?.nombre}</span>
            <span className="truncate text-muted-foreground">{user?.email}</span>
            <span className="text-muted-foreground">{user?.movil}</span>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              icon={Pencil}
              className="w-auto"
              onClick={() => navigate("/mi-perfil/editar")}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              icon={LogOut}
              className="hidden w-auto lg:inline-flex"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </section>

        <div className="grid gap-[22px] lg:grid-cols-2 lg:items-start lg:gap-4">
          {/* Equipos */}
          <section className="flex min-w-0 flex-col gap-2.5 lg:rounded-card-lg lg:border lg:border-border lg:bg-card-2 lg:p-6">
            <SectionTitle
              icon={Users}
              right={<BotonMas label="Crear equipo" onClick={() => navigate("/crear-equipo")} />}
            >
              Equipos
            </SectionTitle>
            <MisEquipos idUsuario={user?.id || ""} />
          </section>

          {/* Competiciones */}
          <section className="flex min-w-0 flex-col gap-2.5 lg:rounded-card-lg lg:border lg:border-border lg:bg-card-2 lg:p-6">
            <SectionTitle
              icon={Trophy}
              right={
                user?.admin ? (
                  <BotonMas label="Crear liga" onClick={() => navigate("/crear-liga")} />
                ) : undefined
              }
            >
              Competiciones
            </SectionTitle>
            <MisCompeticiones />
          </section>
        </div>

        {/* Actualizar y Salir al final (DESIGN.md §6.2 / §6.11) */}
        <div className="mt-auto flex flex-col gap-2 pt-2 lg:hidden">
          <BotonRefrescar />
          <Button variant="outline-danger" icon={LogOut} onClick={handleLogout}>
            Salir
          </Button>
        </div>
        <div className="hidden lg:flex">
          <BotonRefrescar />
        </div>
      </main>
    </>
  );
};
