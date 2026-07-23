function PrototypePage({ title }) {
  return (
    <section className="app-container page-shell flex min-h-full items-center justify-center">
      <div className="ui-card ui-state w-full">
        <p className="type-eyebrow text-[var(--color-primary)]">
          Prototype Version
        </p>
        <h1 className="type-page-title mt-4">
          {title}
        </h1>
      </div>
    </section>
  )
}

export default PrototypePage
