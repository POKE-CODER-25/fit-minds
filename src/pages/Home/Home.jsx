import { useState } from 'react'
import { Link } from 'react-router-dom'
import { workoutDays } from '../../data/workoutDays.js'
import { DAILY_STEP_GOAL, getInitialStepData, getPedometerMetrics } from '../../utils/pedometerData.js'

const weekLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const quickActions = [
  { label: 'Open Workout Planner', to: '/workout', icon: 'M5 12h14M8 8v8m8-8v8M3 10v4m18-4v4' },
  { label: 'View Exercise Rankings', to: '/workout/exercises', icon: 'M5 19V9m5 10V5m5 14v-7m4 7H2' },
  { label: 'Create Diet Report', to: '/diet-report', icon: 'M7 3h10v4H7zM5 7h14v14H5zM8 12h8m-8 4h5' },
  { label: 'Open Pedometer', to: '/pedometer', icon: 'M13 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9.5 21l2-6 2 2v4m-6-9 3-4 3 2 3 1' },
  { label: 'Ask Health AI', to: '/health-ai', icon: 'M12 3v3m0 12v3M3 12h3m12 0h3M8 8l-2-2m10 2 2-2m-2 10 2 2m-10-2-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z' },
  { label: 'Update Profile', to: '/profile', icon: 'M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z' },
]

const aiPrompts = ["Plan today's workout", 'What should I eat today?', 'How should I recover?']

function Icon({ path, className = 'h-5 w-5' }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
      <path d={path} />
    </svg>
  )
}

function ActionLink({ children, className = '', to }) {
  return (
    <Link className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none ${className}`} to={to}>
      {children}
    </Link>
  )
}

function SectionHeading({ eyebrow, title, description, id }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">{eyebrow}</p>
      <h2 className="mt-1.5 text-xl font-black tracking-tight text-white sm:text-2xl" id={id}>{title}</h2>
      {description && <p className="mt-1 text-sm font-semibold leading-6 text-white/50">{description}</p>}
    </div>
  )
}

function Home() {
  const [stepData] = useState(getInitialStepData)
  const today = new Date()
  const mondayIndex = (today.getDay() + 6) % 7
  const currentWorkout = workoutDays[mondayIndex]
  const pedometer = getPedometerMetrics(stepData.todaySteps)
  const formattedSteps = new Intl.NumberFormat('en-IN').format(pedometer.steps)
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const overviewCards = [
    {
      label: "Today's Steps",
      value: pedometer.steps ? formattedSteps : '0',
      detail: pedometer.steps ? `${pedometer.progress}% of ${DAILY_STEP_GOAL.toLocaleString('en-IN')} steps` : 'No steps recorded yet',
      to: '/pedometer',
      accent: 'bg-[#75ff38]',
    },
    {
      label: "Today's Workout",
      value: currentWorkout.rest ? 'Rest Day' : currentWorkout.split,
      detail: currentWorkout.rest ? 'Prioritise recovery today' : `Training Day ${currentWorkout.day}`,
      to: '/workout',
      accent: 'bg-[#ffdd33]',
    },
    {
      label: 'Daily Calories',
      value: 'Not calculated',
      detail: 'Create a diet report',
      to: '/diet-report',
      accent: 'bg-white',
    },
    {
      label: 'Hydration Goal',
      value: 'Not calculated',
      detail: 'Calculate your hydration target',
      to: '/diet-report',
      accent: 'bg-[#bfffa4]',
    },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl overflow-x-clip px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <header className="rounded-[1.75rem] border border-white/10 bg-[#12351f] p-5 shadow-2xl shadow-black/25 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffdd33]">{formattedDate}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Welcome back</h1>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/65 sm:text-base">Small, consistent choices build stronger days. Here is your Fit Minds overview.</p>
          </div>
          <div className="flex flex-col gap-2 min-[380px]:flex-row">
            <ActionLink className="bg-[#75ff38] text-black hover:bg-[#8dff5f]" to="/health-ai">Ask Health AI</ActionLink>
            <ActionLink className="border border-white/15 bg-white/5 text-white hover:bg-white/10" to="/workout">View Today&apos;s Workout</ActionLink>
          </div>
        </div>
      </header>

      <section aria-labelledby="today-overview" className="mt-7">
        <SectionHeading eyebrow="At a glance" id="today-overview" title="Today’s overview" />
        <div className="mt-4 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <Link className="group min-w-0 rounded-2xl border border-white/10 bg-white p-4 text-[#12351f] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:border-[#75ff38]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] motion-reduce:transform-none" key={card.label} to={card.to}>
              <span aria-hidden="true" className={`block h-1.5 w-10 rounded-full ${card.accent}`} />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.13em] text-[#12351f]/50">{card.label}</p>
              <p className="mt-2 break-words text-xl font-black leading-7">{card.value}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-[#12351f]/60">{card.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-white/10 bg-white p-5 text-[#12351f] shadow-xl shadow-black/20 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-green-700">Today’s activity</p>
              <h2 className="mt-2 text-2xl font-black">Pedometer summary</h2>
            </div>
            <span className="w-fit rounded-full bg-[#eefbe8] px-3 py-1.5 text-xs font-black text-green-800">{pedometer.progress}% of goal</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ['Steps', formattedSteps],
              ['Distance', `${pedometer.distanceKm} km`],
              ['Burned', `${pedometer.calories.toLocaleString('en-IN')} kcal`],
            ].map(([label, value]) => (
              <div className="min-w-0 rounded-2xl bg-[#f7fff2] p-3 sm:p-4" key={label}>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#12351f]/45 sm:text-xs">{label}</p>
                <p className="mt-1 break-words text-base font-black sm:text-xl">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5" aria-label={`${pedometer.progress}% of daily step goal`} aria-valuemax="100" aria-valuemin="0" aria-valuenow={pedometer.progress} role="progressbar">
            <div className="h-3 overflow-hidden rounded-full bg-[#12351f]/10"><div className="h-full rounded-full bg-[#75ff38] transition-[width] motion-reduce:transition-none" style={{ width: `${pedometer.progress}%` }} /></div>
            <div className="mt-2 flex justify-between gap-3 text-xs font-bold text-[#12351f]/55"><span>{pedometer.steps ? 'Keep moving' : 'Ready for your first steps'}</span><span>{DAILY_STEP_GOAL.toLocaleString('en-IN')} goal</span></div>
          </div>
          <ActionLink className="mt-5 bg-[#12351f] text-white hover:bg-[#194a2c]" to="/pedometer">{pedometer.steps ? 'Open Pedometer' : 'Start Walking'}</ActionLink>
        </article>

        <article className="rounded-3xl border border-[#75ff38]/25 bg-[#12351f] p-5 shadow-xl shadow-black/25 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">Today’s workout</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">{currentWorkout.rest ? 'Recovery Day' : currentWorkout.split}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-white/60">{currentWorkout.purpose}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#75ff38] px-3 py-1 text-xs font-black text-black">Day {currentWorkout.day}</span>
          </div>
          {!currentWorkout.rest && (
            <div className="mt-5 flex flex-wrap gap-2">{currentWorkout.exerciseMuscles.map((muscle) => <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-white/75" key={muscle}>{muscle}</span>)}</div>
          )}
          <ActionLink className="mt-6 bg-[#ffdd33] text-black hover:bg-[#ffe866]" to={currentWorkout.rest ? '/health-ai' : '/workout'}>{currentWorkout.rest ? 'View Recovery Guidance' : 'Open Workout Planner'}</ActionLink>
        </article>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <article className="rounded-3xl bg-white p-5 text-[#12351f] shadow-xl shadow-black/20 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-green-700">Nutrition</p>
          <h2 className="mt-2 text-xl font-black">Daily targets</h2>
          <div className="mt-5 rounded-2xl bg-[#f7fff2] p-4"><p className="text-sm font-bold leading-6 text-[#12351f]/65">Your nutrition targets are not calculated yet.</p></div>
          <p className="mt-4 text-xs font-semibold leading-5 text-[#12351f]/50">Generate a Diet Recommendation Report to see calories, protein, hydration, and diet preference.</p>
          <ActionLink className="mt-5 bg-[#12351f] text-white" to="/diet-report">Create Diet Report</ActionLink>
        </article>

        <article className="rounded-3xl bg-[#fff9d8] p-5 text-[#12351f] shadow-xl shadow-black/15 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/50">Body Check</p>
          <h2 className="mt-2 text-xl font-black">BMI overview</h2>
          <div className="mt-5 rounded-2xl bg-white/75 p-4"><p className="text-sm font-bold leading-6 text-[#12351f]/65">Calculate your BMI to view your Body Check.</p></div>
          <p className="mt-4 text-xs font-semibold leading-5 text-[#12351f]/50">BMI is a general screening measure and does not diagnose health conditions.</p>
          <ActionLink className="mt-5 bg-[#12351f] text-white" to="/health-ai">Calculate BMI</ActionLink>
        </article>

        <article className="rounded-3xl border border-[#75ff38]/30 bg-gradient-to-br from-[#12351f] to-[#07180d] p-5 shadow-xl shadow-black/25 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#75ff38] text-black"><Icon path="M12 3v3m0 12v3M3 12h3m12 0h3M8 8l-2-2m10 2 2-2m-2 10 2 2m-10-2-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /></span><div><h2 className="text-xl font-black text-white">Health AI</h2><p className="text-xs font-bold text-[#75ff38]">Programmed Coach + AI Support</p></div></div>
          <p className="mt-4 text-sm font-semibold leading-6 text-white/60">Get practical guidance for training, meals, recovery, walking, and healthy habits.</p>
          <div className="mt-4 flex flex-wrap gap-2">{aiPrompts.map((prompt) => <Link className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/75 transition hover:border-[#75ff38]/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33]" key={prompt} to="/health-ai">{prompt}</Link>)}</div>
        </article>
      </div>

      <section aria-labelledby="weekly-routine" className="mt-7">
        <SectionHeading description="The same seven-day split used by Workout Planner." eyebrow="Your training week" id="weekly-routine" title="Weekly routine" />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {workoutDays.map((day, index) => {
            const isToday = index === mondayIndex
            return <article className={`min-w-0 rounded-2xl border p-3 ${isToday ? 'border-[#75ff38] bg-[#75ff38] text-black shadow-lg shadow-[#75ff38]/15' : 'border-white/10 bg-white/5 text-white'}`} key={day.day}><p className={`text-[10px] font-black uppercase tracking-[0.12em] ${isToday ? 'text-black/55' : 'text-white/40'}`}>{weekLabels[index]}</p><p className="mt-2 break-words text-sm font-black leading-5">{day.rest ? 'Rest Day' : day.split}</p>{isToday && <span className="mt-2 inline-block rounded-full bg-black px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#75ff38]">Today</span>}</article>
          })}
        </div>
      </section>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <section aria-labelledby="quick-actions" className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <SectionHeading eyebrow="Shortcuts" id="quick-actions" title="Quick actions" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{quickActions.map((action) => <Link className="group flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-[#12351f] shadow-md transition hover:-translate-y-0.5 hover:border-[#75ff38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] motion-reduce:transform-none" key={action.to} to={action.to}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eefbe8] text-green-800 group-hover:bg-[#75ff38]"><Icon className="h-4 w-4" path={action.icon} /></span><span className="text-sm font-black leading-5">{action.label}</span></Link>)}</div>
        </section>

        <section aria-labelledby="recent-activity" className="rounded-3xl bg-white p-5 text-[#12351f] shadow-xl shadow-black/20 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-green-700">This session</p>
          <h2 id="recent-activity" className="mt-2 text-xl font-black">Recent activity</h2>
          <div className="mt-5 rounded-2xl border border-dashed border-[#12351f]/20 bg-[#f7fff2] p-5 text-center"><p className="text-sm font-bold leading-6 text-[#12351f]/60">Your recent Fit Minds activity will appear here.</p></div>
        </section>
      </div>

      <aside className="mt-6 rounded-2xl border border-[#ffdd33]/35 bg-[#fff9d8] p-4 text-[#12351f] shadow-lg shadow-black/10 sm:p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em]">Safety reminder</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#12351f]/70">Fit Minds provides general fitness guidance only. Consult a qualified healthcare professional for individual medical advice.</p>
      </aside>
    </section>
  )
}

export default Home
