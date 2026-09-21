import type { LucideIcon } from "lucide-react"
import { Icon } from "@/shared/ui/Icon"
import { cn } from "../../utils/cn"
import type { InlinePickerSize } from "./InlinePicker"


export interface InlinePickerItemProps {
    id: number
    label: string
    onClick: (idNewTab: number) => void
    active?: boolean
    showDot?: boolean
    icon?:LucideIcon
    size: InlinePickerSize,
    itemContainerClassName?: string,
    iconClassName?: string,
    textClassName?: string
}

export const InlinePickerItem = (props: InlinePickerItemProps) => {
    const { id, label, onClick, icon, active, showDot, size, itemContainerClassName, iconClassName = '', textClassName = '' } = props

    const sizeClassMap:Record<InlinePickerSize, string> = {
        'sm': 'text-xs',
        'md': 'text-sm',
        'lg': 'text-base'
    }

    return (
        <li
            title={label}
            onClick={() => { onClick(id) }}
            className={cn(`whitespace-nowrap relative w-full cursor-pointer text-lg rounded-lg px-2 min-h-11 py-1.5 text-center transition-colors duration-300 ${active ? 'text-primary-text' : 'text-muted-foreground'} `, itemContainerClassName)}>  
            {icon && <Icon icon={icon} className={cn("mx-auto", iconClassName)}/>}
            <p className={cn(`${sizeClassMap[size]} text-center mx-auto w-full`, textClassName)}>{label}</p>
            {showDot && <span className='absolute right-8 top-1 size-1.5 rounded-full bg-primary'></span>} 
        </li>
    )
}