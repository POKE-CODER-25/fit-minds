function PageHeader({
  actions,
  badge,
  description,
  eyebrow,
  title,
  titleId,
}) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {(eyebrow || badge) && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {eyebrow && <p className="type-eyebrow text-[var(--color-primary)]">{eyebrow}</p>}
            {badge}
          </div>
        )}
        <h1 className="type-page-title" id={titleId}>
          {title}
        </h1>
        {description && (
          <p className="type-body-large mt-4 text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-col gap-3 min-[380px]:flex-row">{actions}</div>
      )}
    </header>
  )
}

export default PageHeader
