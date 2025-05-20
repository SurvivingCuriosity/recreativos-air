import { Route, Routes } from "react-router";
import { CompeticionesPage } from "../features/Competiciones/pages/CompeticionesPage";
import { LandingPage } from "../features/LandingPage/LandingPage";
import { LoginPage } from "../features/Login/LoginPage";
import { MainLayout } from "../shared/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* PUBLICAS */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
        <Route path="competiciones" element={<CompeticionesPage />} />
        </Route>
       
      </Route>
    </Routes>
  );
};
