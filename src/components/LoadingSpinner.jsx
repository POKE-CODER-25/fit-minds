function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div
      aria-live="polite"
      className="app-container flex min-h-[50vh] items-center justify-center py-12"
      role="status"
    >
      <div className="ui-card ui-state min-w-56">
        <span
          aria-hidden="true"
          className="ui-spinner h-8 w-8 text-[var(--color-primary)]"
        />
        <p className="type-label text-[var(--color-text-secondary)]">
          {label}
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner
