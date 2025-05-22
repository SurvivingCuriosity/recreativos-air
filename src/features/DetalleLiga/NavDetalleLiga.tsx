import {
  faCalendarDays,
  faInfoCircle,
  faListOl,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { InlinePicker } from "../../packages/components/InlinePicker/InlinePicker";

export const NavDetalleLiga = () => {
  const [activeTab, setActiveTab] = useState(1);

  const labelMap: Record<number, string> = {
    1: "Clasificación",
    2: "Jornadas",
    3: "Equipos",
    4: "Información",
  };

  return (
    <nav className="mt-2">
      <InlinePicker
        options={[
          { id: 1, label: "", icon: faListOl },
          { id: 2, label: "", icon: faCalendarDays },
          { id: 3, label: "", icon: faPeopleGroup },
          { id: 4, label: "", icon: faInfoCircle },
        ]}
        onTabClick={setActiveTab}
        size="md"
      />
      <p className="font-cool text-lg mt-2">{labelMap[activeTab]}</p>
    </nav>
  );
};
