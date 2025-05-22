import React from 'react'

export const FormLabel = ({children}: {children: React.ReactNode}) => {
  return (
    <label className='text-sm'>{children}</label>
  )
}
