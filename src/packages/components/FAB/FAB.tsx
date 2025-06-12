import {
  faPlus,
  faXmark,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, type ReactNode } from "react";

export interface FabItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface FabProps {
  items: FabItem[];
  className?: string;
  showLabels?: boolean;
  openIcon?: IconDefinition;
  closeIcon?: IconDefinition;
}

export const Fab: React.FC<FabProps> = ({
  items,
  className = "",
  showLabels = true,
  openIcon = faPlus,
  closeIcon = faXmark,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = (callback?: () => void) => () => {
    if (callback) {
      callback();
    }
    setOpen(false);
  };

  return (
    <div
      className={`fixed right-4 bottom-4 z-1 flex flex-col items-end ${className}`}
    >
      {/* <div
        onClick={() => setOpen(false)}
        className={`transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        } fixed top-0 left-0 -z-1 bg-neutral-950/70 w-screen h-screen`}
      ></div> */}

      <ul
        className={`z-5 flex flex-col items-center mb-4 transition-all duration-300
        ${
          open
            ? "opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 translate-y-4"
        }`}
      >
        {items.map(({ label, onClick: callback, icon }) => (
          <li key={label} className="my-2 ml-auto">
            <button
              onClick={handleClick(callback)}
              aria-label={label}
              className="min-w-44 w-full font-medium bg-primary text-black p-2 px-3 rounded-lg flex gap-2 items-center"
            >
              {icon}

              {showLabels && label}
            </button>
          </li>
        ))}
      </ul>

      {/* Botón principal */}
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen(!open)}
        className="z-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-black shadow-lg
                   transition-transform duration-300 hover:bg-primary/70 focus:outline-none
                   focus-visible:ring-2 focus-visible:ring-primary/70"
      >
        <FontAwesomeIcon
          icon={open ? closeIcon : openIcon}
          className={`text-2xl transition-transform duration-300`}
        />
      </button>
    </div>
  );
};

export default Fab;
