import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeText: (value: string) => void;
  hasError?: boolean;
}

export const PasswordInput = (props: PasswordInputProps) => {
  const { onChangeText, hasError, ...rest } = props;

  const [showingPass, setShowingPass] = useState(false);

  return (
    <div className="relative">
      <input
        type={showingPass ? "text" : "password"}
        onChange={(e) => onChangeText(e.target.value)}
        className={`h-10 ${
          hasError ? "bg-red-600/20" : "bg-neutral-800"
        } w-full p-1 px-2 rounded-2xl outline-0 focus:outline-1 outline-primary disabled:bg-neutral-600 disabled:text-neutral-500 disabled:cursor-not-allowed`}
        {...rest}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowingPass(!showingPass);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400"
      >
        <FontAwesomeIcon icon={showingPass ? faEyeSlash : faEye} />
      </button>
    </div>
  );
};
