import { Input } from "@/components/ui/input";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeText: (value: string) => void;
  hasError?: boolean;
}

export const TextInput = (props: TextInputProps) => {
  const { onChangeText, hasError, className, ...rest } = props;

  return (
    <Input
      type="text"
      onChange={(e) => onChangeText(e.target.value)}
      aria-invalid={hasError || undefined}
      className={className}
      {...rest}
    />
  );
};
