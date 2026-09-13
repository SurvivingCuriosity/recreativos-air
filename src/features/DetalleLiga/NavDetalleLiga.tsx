import {
  faCalendarDays,
  faGear,
  faInfoCircle,
  faListOl,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router";
import { InlinePicker } from "../../packages/components/InlinePicker/InlinePicker";
import { useAuth } from "../../shared/api/auth/useAuth";

export const NavDetalleLiga = () => {
  const [activeTab, setActiveTab] = useState(getActiveTabBasedOnUrlValue());
  const navigate = useNavigate();
  const { user } = useAuth();

  const labelMap: Record<number, string> = {
    1: "Clasificación",
    2: "Jornadas",
    3: "Equipos",
    4: "Información",
    5: "Ajustes",
  };
  const navigateMap: Record<number, string> = {
    1: "clasificacion",
    2: "jornadas",
    3: "equipos",
    4: "info",
    5: "ajustes",
  };

  function getActiveTabBasedOnUrlValue() {
    const urlSegments = new URL(window.location.href).toString().split("/");
    let value = 1;
    if (urlSegments.includes("clasificacion")) {
      value = 1;
    }
    if (urlSegments.includes("jornadas")) {
      value = 2;
    }
    if (urlSegments.includes("equipos")) {
      value = 3;
    }
    if (urlSegments.includes("info")) {
      value = 4;
    }
    if (urlSegments.includes("ajustes")) {
      value = 5;
    }
    return value;
  }

  const handleTabClick = (id: number) => {
    setActiveTab(id);
    navigate(navigateMap[id], { replace: true });
  };

  return (
    <>
      <nav
        style={{ animationDelay: "0.2s" }}
        className="mt-2 animate-fade-in-top"
      >
        <InlinePicker
          options={[
            { id: 1, label: "", icon: faListOl },
            { id: 2, label: "", icon: faCalendarDays },
            { id: 3, label: "", icon: faPeopleGroup },
            { id: 4, label: "", icon: faInfoCircle },
            ...(user?.admin ? [{ id: 5, label: "", icon: faGear }] : []),
          ]}
          activeTabId={activeTab}
          onTabClick={handleTabClick}
          size="md"
        />
      </nav>
      <p
        style={{ animationDelay: "0.4s" }}
        className="z-2 animate-fade-in-top font-cool text-xl py-1 font-black sticky top-9.5 bg-neutral-950"
      >
        {labelMap[activeTab]}
      </p>
    </>
  );
};
