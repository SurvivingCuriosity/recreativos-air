import { Route, Routes } from "react-router";
import { CompeticionesPage } from "../features/Competiciones/pages/CompeticionesPage";
import { CrearLigaPage } from "../features/CrearLiga/CrearLigaPage";
import { DetalleLigaLayout } from "../features/DetalleLiga/DetalleLigaLayout";
import { ClasificacionLigaPage } from "../features/DetalleLiga/pages/ClasificacionLigaPage";
import { EquiposLigaPage } from "../features/DetalleLiga/pages/EquiposLigaPage";
import { InfoLigaPage } from "../features/DetalleLiga/pages/InfoLigaPage";
import { JornadasLigaPage } from "../features/DetalleLiga/pages/JornadasLigaPage";
import { LandingPage } from "../features/LandingPage/LandingPage";
import { LoginPage } from "../features/Login/LoginPage";
import { CompeticionesLayout } from "../shared/layouts/CompeticionesLayout";
import { MainLayout } from "../shared/layouts/MainLayout";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { CrearEquipoPage } from "../features/CrearEquipo/CrearEquipoPage";
import { MiPerfilPage } from "../features/MiPerfil/MiPerfilPage";
import { FakeLandingPage } from "../features/LandingPage/FakeLandingPage";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* PUBLICAS */}
        <Route index element={<FakeLandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* PROTEGIDAS */}
      <Route element={<ProtectedRoute />}>
        <Route element={<CompeticionesLayout />}>
          <Route path="competiciones" element={<CompeticionesPage />} />
          <Route path="mi-perfil" element={<MiPerfilPage />} />
          <Route path="crear-equipo" element={<CrearEquipoPage />} />
          <Route path="competiciones/:id" element={<DetalleLigaLayout />}>
            <Route path="info" element={<InfoLigaPage />} />
            <Route path="jornadas" element={<JornadasLigaPage />} />
            <Route path="clasificacion" element={<ClasificacionLigaPage />} />
            <Route path="equipos" element={<EquiposLigaPage />} />
          </Route>
        </Route>
      </Route>

      {/* ADMIN */}
      <Route element={<AdminRoute />}>
        <Route element={<CompeticionesLayout />}>
          <Route path="crear-liga" element={<CrearLigaPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
