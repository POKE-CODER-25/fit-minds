function ErrorState({ actions, description, icon, title = 'Something went wrong' }) {
  return (
    <div aria-live="polite" className="ui-card ui-state ui-state--error" role="alert">
      {icon && <span className="ui-state__icon">{icon}</span>}
      <h2 className="type-card-title">{title}</h2>
      {description && (
        <p className="type-body-small max-w-md text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
      {actions && <div className="ui-state__actions">{actions}</div>}
    </div>
  )
}

export default ErrorState
