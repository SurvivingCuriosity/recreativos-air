import { REGEXP_ONLY_DIGITS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

/** Código de 6 dígitos (InputOTP). */
export const CodeInput = ({
  id,
  value,
  onChange,
  hasError,
  autoFocus,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  autoFocus?: boolean;
}) => (
  <InputOTP
    id={id}
    maxLength={6}
    value={value}
    onChange={onChange}
    pattern={REGEXP_ONLY_DIGITS}
    inputMode="numeric"
    autoComplete="one-time-code"
    autoFocus={autoFocus}
    aria-invalid={hasError || undefined}
    containerClassName="w-full"
  >
    <InputOTPGroup>
      {Array.from({ length: 6 }, (_, i) => (
        <InputOTPSlot
          key={i}
          index={i}
          aria-label={`Dígito ${i + 1}`}
          aria-invalid={hasError || undefined}
        />
      ))}
    </InputOTPGroup>
  </InputOTP>
);
