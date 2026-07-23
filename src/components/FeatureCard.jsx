import { Link } from 'react-router-dom'

function FeatureCard({ description, title, to }) {
  return (
    <Link
      className="ui-card ui-card--feature ui-card--interactive group flex flex-col justify-between"
      to={to}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="type-card-title text-white">{title}</h2>
          <span className="ui-badge ui-badge--neutral shrink-0">
            Prototype
          </span>
        </div>
        <p className="type-body-small mt-4 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      <p className="type-label mt-6 text-[var(--color-primary)] transition group-hover:text-white">
        Open
      </p>
    </Link>
  )
}

export default FeatureCard
