import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export const ThemeSwitcher = () => {
  const { darkMode, setDarkMode } = use(ThemeContext);
  return (
      <button onClick={() => setDarkMode(!darkMode)} className="aspect-square size-10 ml-4 border rounded-lg bg-neutral-800 border-neutral-700 flex items-center justify-center">
        <FontAwesomeIcon
          icon={darkMode ? faSun : faMoon}
          className="text-neutral-400 text-xl"
        />
      </button>
  );
};
