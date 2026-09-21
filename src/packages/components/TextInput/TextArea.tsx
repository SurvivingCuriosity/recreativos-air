import { Textarea } from "@/components/ui/textarea";

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TextArea = (props: TextInputProps) => {
  const { value, onChange, placeholder, disabled = false } = props;

  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="max-h-40 min-h-18"
    />
  );
};
