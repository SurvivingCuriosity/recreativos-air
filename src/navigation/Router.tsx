import { Route, Routes } from "react-router";
import { CompeticionesPage } from "../features/Competiciones/pages/CompeticionesPage";
import { CrearEquipoPage } from "../features/CrearEquipo/CrearEquipoPage";
import { CrearLigaPage } from "../features/CrearLiga/CrearLigaPage";
import { DetalleLigaLayout } from "../features/DetalleLiga/DetalleLigaLayout";
import { ClasificacionLigaPage } from "../features/DetalleLiga/pages/ClasificacionLigaPage";
import { EquiposLigaPage } from "../features/DetalleLiga/pages/EquiposLigaPage";
import { InfoLigaPage } from "../features/DetalleLiga/pages/InfoLigaPage";
import { JornadasLigaPage } from "../features/DetalleLiga/pages/JornadasLigaPage";
import { DetalleEquipoPage } from "../features/Equipos/DetalleEquipo/DetalleEquipoPage";
import { DetalleJornadaPage } from "../features/Jornadas/DetalleJornada/DetalleJornadaPage";
import { LandingPage } from "../features/LandingPage/LandingPage";
import { LoginPage } from "../features/Login/LoginPage";
import { MiPerfilPage } from "../features/MiPerfil/MiPerfilPage";
import { PerfilPublicoPage } from "../features/PerfilPublico/PerfilPublicoPage";
import { RegisterPage } from "../features/Register/RegisterPage";
import { VerifyEmailPage } from "../features/VerifyEmail/VerifyEmailPage";
import { MainLayout } from "../shared/layouts/MainLayout";
import RequireAdmin from "./components/RequireAdmin";
import RequireAuth from "./components/RequireAuth";
import { AdminEquiposPage } from "../features/Admin/AdminEquiposPage";
import { AdminUsuariosPage } from "../features/Admin/AdminUsuariosPage";
import { ResetPasswordPage } from "../features/ResetPassword/ResetPasswordPage";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* PUBLICAS */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="competiciones" element={<CompeticionesPage />} />
      </Route>

      {/* PROTEGIDAS */}
      <Route element={<MainLayout />}>
        <Route element={<RequireAuth />}>
          <Route path="user/:id" element={<PerfilPublicoPage />} />
          <Route path="mi-perfil" element={<MiPerfilPage />} />
          <Route path="crear-equipo" element={<CrearEquipoPage />} />
          <Route path="equipos/:id" element={<DetalleEquipoPage />} />
          <Route path="jornadas/:id" element={<DetalleJornadaPage />} />
          <Route path="competiciones/:id" element={<DetalleLigaLayout />}>
            <Route path="info" element={<InfoLigaPage />} />
            <Route path="jornadas" element={<JornadasLigaPage />} />
            <Route path="clasificacion" element={<ClasificacionLigaPage />} />
            <Route path="equipos" element={<EquiposLigaPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        {/* ADMIN */}
        <Route element={<RequireAdmin />}>
          <Route path="crear-liga" element={<CrearLigaPage />} />
          <Route path="admin-equipos" element={<AdminEquiposPage />} />
          <Route path="admin-usuarios" element={<AdminUsuariosPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
