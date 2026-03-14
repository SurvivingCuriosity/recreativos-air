
export interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export const TextArea = (props: TextInputProps) => {

    const { value, onChange, placeholder, disabled = false } = props

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="h-18 max-h-32 min-h-10 bg-neutral-800 p-1 px-2 rounded-2xl outline-0 focus:outline-1 outline-primary disabled:bg-neutral-600 disabled:text-neutral-500 disabled:cursor-not-allowed"
    />
  )
}
