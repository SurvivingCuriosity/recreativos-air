import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeText: (value: string) => void;
  hasError?: boolean;
}

export const PasswordInput = (props: PasswordInputProps) => {
  const { onChangeText, hasError, className, ...rest } = props;

  const [showingPass, setShowingPass] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showingPass ? "text" : "password"}
        onChange={(e) => onChangeText(e.target.value)}
        aria-invalid={hasError || undefined}
        className={className ? `pr-12 ${className}` : "pr-12"}
        {...rest}
      />
      <button
        type="button"
        aria-label={showingPass ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={(e) => {
          e.preventDefault();
          setShowingPass(!showingPass);
        }}
        className="absolute top-0.5 right-0.5 flex size-11 items-center justify-center rounded-input text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        {showingPass ? (
          <EyeOff size={18} aria-hidden="true" />
        ) : (
          <Eye size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
