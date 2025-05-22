import React from 'react'

export const FormField = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='space-y-0.5 flex flex-col mb-2'>{children}</div>
  )
}
