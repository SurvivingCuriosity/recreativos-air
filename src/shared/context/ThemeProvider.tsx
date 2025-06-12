import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}


export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

    useEffect(() => {
        cambiarTema(darkMode);
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};


const cambiarTema = (darkMode: boolean) => {
    const root = document.documentElement;
    if(darkMode){
        root.classList.remove("light");
    } else {
        root.classList.add("light");
    }
};