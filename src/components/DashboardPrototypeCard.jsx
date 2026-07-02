const dashboardStats = [
  ['BMI', '--'],
  ['Goal', 'Profile Based'],
  ["Today's Steps", '--'],
  ['Calories Target', '--'],
  ['Profile Status', 'Active'],
]

function DashboardPrototypeCard() {
  return (
    <article className="rounded-2xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Static Preview
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#12351f]">
            Prototype Dashboard
          </h2>
        </div>
        <span className="w-fit rounded-full bg-[#12351f] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#ffdd33]">
          Prototype
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {dashboardStats.map(([label, value]) => (
          <div
            className="rounded-xl border border-[#12351f]/10 bg-[#f7fff2] p-4"
            key={label}
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              {label}
            </p>
            <p className="mt-2 text-lg font-black text-[#12351f]">{value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

export default DashboardPrototypeCard
