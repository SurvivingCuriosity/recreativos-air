
export interface GlowButtonProps {
    as: 'a' | 'button'
    href?: string
    children: React.ReactNode
}

export const GlowButton = (props: GlowButtonProps) => {

    const {children, as} = props

    const Component = as === 'a' ? 'a' : 'button'

  return (
    <Component>
        {children}
    </Component>
  )
}
