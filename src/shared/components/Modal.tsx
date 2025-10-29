import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
};

const sizeToMaxW: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  size = "md",
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
}: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC para cerrar
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus inicial + bloquear scroll
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={closeOnOverlay ? onClose : undefined}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
        className={`relative bg-neutral-100 rounded-2xl shadow-xl w-full ${sizeToMaxW[size]} mx-4 outline-none transform transition-transform duration-200 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 pt-4">
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="p-2 rounded-full hover:bg-neutral-200 active:scale-95 transition"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5 text-neutral-700" />
              </button>
            )}
          </div>
        )}

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
};
