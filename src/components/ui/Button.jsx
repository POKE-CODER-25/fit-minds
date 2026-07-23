import { Link } from 'react-router-dom'

const variants = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  accent: 'ui-button--accent',
  ghost: 'ui-button--ghost',
  danger: 'ui-button--danger',
}

const sizes = {
  small: 'ui-button--sm',
  medium: '',
  large: 'ui-button--lg',
}

function Button({
  children,
  className = '',
  disabled = false,
  fullWidth = false,
  loading = false,
  onClick,
  size = 'medium',
  to,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  const classes = [
    'ui-button',
    variants[variant] || variants.primary,
    sizes[size] || '',
    fullWidth ? 'ui-button--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link
        aria-disabled={disabled || loading || undefined}
        className={classes}
        onClick={(event) => {
          if (disabled || loading) {
            event.preventDefault()
            return
          }
          onClick?.(event)
        }}
        tabIndex={disabled || loading ? -1 : undefined}
        to={to}
        {...props}
      >
        {loading && <span aria-hidden="true" className="ui-spinner" />}
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <span aria-hidden="true" className="ui-spinner" />}
      {children}
    </button>
  )
}

export default Button
