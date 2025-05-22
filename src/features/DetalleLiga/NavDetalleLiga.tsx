import {
  faCalendarDays,
  faInfoCircle,
  faListOl,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router";
import { InlinePicker } from "../../packages/components/InlinePicker/InlinePicker";

export const NavDetalleLiga = () => {
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();

  const labelMap: Record<number, string> = {
    1: "Clasificación",
    2: "Jornadas",
    3: "Equipos",
    4: "Información",
  };
  const navigateMap: Record<number, string> = {
    1: "clasificacion",
    2: "jornadas",
    3: "equipos",
    4: "info",
  };

  const handleTabClick = (id: number) => {
    setActiveTab(id);
    navigate(navigateMap[id]);
  };

  return (
    <>
      <nav style={{animationDelay: '0.2s'}} className="mt-2 animate-fade-in-top">
        <InlinePicker
          options={[
            { id: 1, label: "", icon: faListOl },
            { id: 2, label: "", icon: faCalendarDays },
            { id: 3, label: "", icon: faPeopleGroup },
            { id: 4, label: "", icon: faInfoCircle },
          ]}
          onTabClick={handleTabClick}
          size="md"
        />
      </nav>
      <p style={{animationDelay: '0.4s'}} className="z-2 animate-fade-in-top font-cool text-xl py-1 font-black sticky top-9.5 bg-neutral-950">
        {labelMap[activeTab]}
      </p>
    </>
  );
};
