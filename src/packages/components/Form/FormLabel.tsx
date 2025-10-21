import React from 'react'

export const FormLabel = ({children}: {children: React.ReactNode}) => {
  return (
    <label className='text-sm text-neutral-200'>{children}</label>
  )
}
