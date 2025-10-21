import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Window } from "../../packages/components/Window/Window";

type WindowContextType = {
  show: (content: React.ReactElement, title?: string) => void;
  close: () => void;
};

const WindowContext = createContext<WindowContextType | null>(null);

export const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<React.ReactElement | null>(null);
  const [title, setTitle] = useState<string>("");

  const show = (component: React.ReactElement, titleText = "Ventana") => {
    setTitle(titleText);
    setContent(component);
  };

  const close = () => setContent(null);

  return (
    <WindowContext.Provider value={{ show, close }}>
      {children}
      {content &&
        createPortal(
          <Window titulo={title} onClose={close}>
            {content}
          </Window>,
          document.body
        )}
    </WindowContext.Provider>
  );
};

export const useWindow = () => {
  const ctx = useContext(WindowContext);
  if (!ctx) {
    throw new Error("useWindow debe usarse dentro de <WindowProvider>");
  }
  return ctx;
};
