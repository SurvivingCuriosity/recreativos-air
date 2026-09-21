import { Textarea } from "@/components/ui/textarea";

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export const TextArea = (props: TextInputProps) => {
  const { value, onChange, placeholder, disabled = false, id } = props;

  return (
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="max-h-40 min-h-19 resize-y"
    />
  );
};
