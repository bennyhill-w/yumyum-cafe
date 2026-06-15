import { forwardRef } from 'react'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-brand-red text-white hover:bg-brand-red-dark focus-visible:ring-brand-red',
  secondary: 'bg-brand-gold text-brand-gold-light hover:bg-brand-gold/90 focus-visible:ring-brand-gold',
  outline: 'bg-transparent border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white focus-visible:ring-brand-red',
  ghost: 'bg-transparent text-brand-red hover:bg-brand-red-light focus-visible:ring-brand-red',
  white: 'bg-white text-brand-red hover:bg-white/90 focus-visible:ring-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-150 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'sm' ? 14 : 16} color="currentColor" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  )
})

export default Button