import { Link } from 'react-router-dom'

function FeatureCard({ description, title, to }) {
  return (
    <Link
      className="group flex min-h-48 flex-col justify-between rounded-2xl bg-[#12351f] p-5 shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-[#174629]"
      to={to}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <span className="shrink-0 rounded-full bg-[#ffdd33] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
            Prototype
          </span>
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-white/72">
          {description}
        </p>
      </div>
      <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[#75ff38] transition group-hover:text-[#ffdd33]">
        Open
      </p>
    </Link>
  )
}

export default FeatureCard
