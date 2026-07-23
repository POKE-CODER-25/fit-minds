function EmptyState({ action, description, icon, title }) {
  return (
    <div className="ui-card ui-state" role="status">
      {icon && <span className="ui-state__icon">{icon}</span>}
      <h2 className="type-card-title">{title}</h2>
      {description && (
        <p className="type-body-small max-w-md text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
      {action && <div className="ui-state__actions">{action}</div>}
    </div>
  )
}

export default EmptyState
