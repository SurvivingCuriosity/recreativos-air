import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  useEffect(() => { setMount(document.body); }, []);
  if (!mount) return null;
  return createPortal(children, mount);
};
