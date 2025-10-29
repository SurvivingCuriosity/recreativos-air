import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, useEffect } from "react";

type BottomSheetDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export const BottomSheetDrawer = ({
  isOpen,
  onClose,
  children,
  title,
}: BottomSheetDrawerProps) => {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div
      className={`text-neutral-500 font-medium placeholder:text-neutral-500 fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      {/* Sheet */}
      <div
        className={`overflow-hidden absolute bottom-0 left-0 right-0 bg-neutral-200 rounded-t-2xl shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 relative">
          <button onClick={onClose} className="absolute top-1 right-1 p-2">
            <FontAwesomeIcon
              icon={faXmark}
              className="text-neutral-600 hover:text-neutral-700"
            />
          </button>
          {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
};
