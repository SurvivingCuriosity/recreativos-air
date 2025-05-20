import { Route, Routes } from "react-router";
import { CompeticionesPage } from "../features/Competiciones/pages/CompeticionesPage";
import { LandingPage } from "../features/LandingPage/LandingPage";
import { MainLayout } from "../shared/layouts/MainLayout";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="competiciones" element={<CompeticionesPage />} />
        {/* <Route path="about" element={<About />} /> */}

        {/* <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        </Route>
        
        <Route path="concerts">
        <Route index element={<ConcertsHome />} />
        <Route path=":city" element={<City />} />
        <Route path="trending" element={<Trending />} />
        </Route> */}
      </Route>
    </Routes>
  );
};
