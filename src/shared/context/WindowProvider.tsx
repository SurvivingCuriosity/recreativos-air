import { createContext, useContext, useState } from "react";
import { Window } from "../../packages/components/Window/Window";

type WindowContextType = {
  show: (content: React.ReactElement, title?: string) => void;
  close: () => void;
};

const WindowContext = createContext<WindowContextType | null>(null);

/** Título por defecto según DESIGN.md §6.9 (nunca «Ventana»). */
const DEFAULT_TITLE = "Elige un equipo";

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);

  const show = (component: React.ReactElement, titleText = DEFAULT_TITLE) => {
    setTitle(titleText);
    setContent(component);
  };

  const close = () => setContent(null);

  return (
    <WindowContext.Provider value={{ show, close }}>
      {children}
      {content && (
        <Window titulo={title} onClose={close}>
          {content}
        </Window>
      )}
    </WindowContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWindow = () => {
  const ctx = useContext(WindowContext);
  if (!ctx) {
    throw new Error("useWindow debe usarse dentro de <WindowProvider>");
  }
  return ctx;
};
