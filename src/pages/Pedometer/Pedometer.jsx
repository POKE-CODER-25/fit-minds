const todayStats = [
  ['Distance', '0.00 km'],
  ['Calories Burned', '0 kcal'],
  ['Active Time', '0 min'],
]

const detectionLabels = [
  'Auto walk detection',
  'Stops when user stops',
  'Daily reset at 12:00 AM IST',
  "Stores yesterday's steps",
]

const supportLabels = [
  'Mobile supported',
  'Desktop fallback',
  'Permission required',
]

function PedometerCard({ children, className = '' }) {
  return (
    <article
      className={`rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6 ${className}`}
    >
      {children}
    </article>
  )
}

function Pedometer() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Prototype Pedometer
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Smart Step Tracker
        </h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-white/72">
          Automatic walking detection will be enabled in the real version.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <PedometerCard>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
                Steps Today
              </p>
              <p className="mt-3 text-6xl font-black leading-none text-[#12351f] sm:text-7xl">
                0
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#75ff38] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-black shadow-md shadow-[#75ff38]/20">
              Prototype Mode
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f7fff2] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
                  Daily Goal
                </p>
                <p className="mt-1 text-xl font-black text-[#12351f]">
                  8,000 steps
                </p>
              </div>
              <p className="text-xl font-black text-[#12351f]">0%</p>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#12351f]/12">
              <div className="h-full w-0 rounded-full bg-[#75ff38]" />
            </div>
          </div>
        </PedometerCard>

        <PedometerCard className="bg-[#fff9d8]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
            Yesterday
          </p>
          <p className="mt-3 text-4xl font-black text-[#12351f]">0 steps</p>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#12351f]/70">
            Daily history will be saved after real tracking is enabled.
          </p>
        </PedometerCard>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {todayStats.map(([label, value]) => (
          <PedometerCard className="p-5 sm:p-5" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
              {label}
            </p>
            <p className="mt-3 text-2xl font-black text-[#12351f]">{value}</p>
          </PedometerCard>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PedometerCard className="bg-[#12351f] text-white">
          <h2 className="text-2xl font-black">Walking Detection Preview</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/72">
            Real version will count steps when walking and pause when movement
            stops.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {detectionLabels.map((label) => (
              <span
                className="rounded-full border border-[#75ff38]/35 bg-black px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#75ff38]"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </PedometerCard>

        <PedometerCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
            Stopwatch Prototype
          </p>
          <p className="mt-3 text-4xl font-black text-[#12351f]">00:00:00</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              className="min-h-12 rounded-2xl bg-[#75ff38] px-4 py-3 text-sm font-black text-black shadow-lg shadow-[#75ff38]/20 transition hover:bg-[#8dff5f]"
              type="button"
            >
              Start
            </button>
            <button
              className="min-h-12 rounded-2xl bg-[#ffdd33] px-4 py-3 text-sm font-black text-black shadow-lg shadow-[#ffdd33]/20 transition hover:bg-[#ffe866]"
              type="button"
            >
              Pause
            </button>
            <button
              className="min-h-12 rounded-2xl border border-[#12351f]/15 bg-white px-4 py-3 text-sm font-black text-[#12351f] transition hover:bg-[#f7fff2]"
              type="button"
            >
              Reset
            </button>
          </div>
        </PedometerCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PedometerCard>
          <h2 className="text-2xl font-black text-[#12351f]">
            Permission / Device Support
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
            Step tracking works best on supported mobile browsers with motion
            permissions.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {supportLabels.map((label) => (
              <span
                className="rounded-full bg-[#f7fff2] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#12351f]"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </PedometerCard>

        <PedometerCard className="border border-[#ffdd33]/50 bg-[#fff9d8]">
          <h2 className="text-2xl font-black text-[#12351f]">Safety Note</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#12351f]/75">
            Walk at your own pace. If you feel dizziness, chest pain, joint
            pain, or breathing difficulty, stop and consult a healthcare
            professional.
          </p>
        </PedometerCard>
      </div>
    </section>
  )
}

export default Pedometer
