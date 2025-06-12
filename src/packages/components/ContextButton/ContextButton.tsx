import {
  faPlus,
  faXmark,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export interface ContextButtonItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface ContextButtonProps {
  items: ContextButtonItem[];
  className?: string;
  showLabels?: boolean;
  openIcon?: IconDefinition;
  closeIcon?: IconDefinition;
  open?: boolean;
  onClick?: () => void;    // Para abrir/cerrar con el botón
  onClose?: () => void;    // Para cerrar al hacer clic fuera
}

export const ContextButton: React.FC<ContextButtonProps> = ({
  items,
  className = "",
  showLabels = true,
  openIcon = faPlus,
  closeIcon = faXmark,
  open = false,
  onClick = () => {},
  onClose = () => {},
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose(); // Cierra si el clic fue fuera
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  const handleItemClick = (callback?: () => void) => () => {
    callback?.();
    onClose();
  };

  return (
    <div ref={ref} className={className + " relative z-1"}>
      <button
        onClick={(e)=>{
          e.stopPropagation()
          onClick()
        }}
        className="size-8 text-neutral-600 z-1 relative"
      >
        <FontAwesomeIcon
          icon={open ? closeIcon : openIcon}
          className="text-2xl transition-transform duration-300"
        />
      </button>

      {open && (
        <div className="absolute top-[70%] right-9 animate-fade-in-top space-y-1 z-90">
          {items.map(({ label, onClick: callback, icon }) => (
            <button
              key={label}
              onClick={handleItemClick(callback)}
              aria-label={label}
              className="w-60 z-80 relative font-medium bg-zinc-200 border border-neutral-800 text-black p-2 px-3 rounded-lg flex gap-2 items-center"
            >
              {icon}
              {showLabels && label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
