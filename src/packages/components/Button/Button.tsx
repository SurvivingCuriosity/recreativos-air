import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { type MouseEvent } from 'react'

export interface ButtonProps {
    as?: 'button' | 'a'
    onClick: () => void
    children: React.ReactNode
    href?: string
    icon?:IconDefinition
}

export const Button = (props: ButtonProps) => {

    const { as = "button", onClick, children, href, icon } = props

    const Component = href ? as === 'a' ? 'a' : 'button' : as

    const handleClick = (e:MouseEvent) => {
        e.preventDefault()
        onClick()
    }

  return (
    <Component onClick={handleClick} href={href} className="h-9 flex items-center justify-center bg-primary text-black font-bold px-3 py-1 rounded-lg gap-2">
        {icon && <FontAwesomeIcon icon={icon} className="w-5 h-5" />}
        {children}
    </Component>
  )
}
