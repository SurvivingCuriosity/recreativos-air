import React from 'react'

export const FormLabel = ({children, htmlFor}: {children: React.ReactNode, htmlFor?: string}) => {
  return (
    <label htmlFor={htmlFor} className='text-sm text-neutral-200'>{children}</label>
  )
}
