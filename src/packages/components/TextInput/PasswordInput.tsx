import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const PasswordInput = (props: PasswordInputProps) => {
  const { value, onChange, placeholder, disabled = false } = props;

  const [showingPass, setShowingPass] = useState(false);

  return (
    <div className="relative">
      <input
        type={showingPass ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-9 bg-neutral-800 w-full p-1 px-2 rounded-md outline-0 focus:outline-1 outline-primary disabled:bg-neutral-600 disabled:text-neutral-500 disabled:cursor-not-allowed"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          setShowingPass(!showingPass);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400"
      >
        <FontAwesomeIcon
          icon={showingPass ? faEyeSlash : faEye}
        />
      </button>
    </div>
  );
};
