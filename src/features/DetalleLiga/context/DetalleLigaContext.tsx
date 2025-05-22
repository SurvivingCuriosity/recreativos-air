import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { Liga } from '../../../shared/interfaces/Liga';

export type DetalleLigaContextType = {
  liga: Liga|undefined;
  setLiga: Dispatch<SetStateAction<Liga>>;
}

export const DetalleLigaContext = createContext<DetalleLigaContextType>({} as DetalleLigaContextType);