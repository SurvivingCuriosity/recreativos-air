
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChangeText: (value: string) => void;
  hasError?: boolean;
}

export const TextInput = (props: TextInputProps) => {

    const { onChangeText, hasError, ...rest } = props;

  return (
    <input
      type="text"
      onChange={(e) => onChangeText(e.target.value)}
      className={`w-full h-9 ${hasError ? 'bg-red-600/20' : 'bg-neutral-800'}  p-1 px-2 rounded-md outline-0 focus:outline-1 outline-primary disabled:bg-neutral-600 disabled:text-neutral-500 disabled:cursor-not-allowed`}
      {...rest}
    />
  )
}
