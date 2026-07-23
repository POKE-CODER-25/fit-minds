import { useState } from 'react'
import { Link } from 'react-router-dom'
import { workoutDays } from '../../data/workoutDays.js'
import {
  getInitialStepData,
  getPedometerMetrics,
} from '../../utils/pedometerData.js'

const weekLabels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const icons = {
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  workout: 'M5 12h14M8 8v8m8-8v8M3 10v4m18-4v4',
  diet: 'M7 3h10v4H7zM5 7h14v14H5zM8 12h8m-8 4h5',
  steps:
    'M13 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9.5 21l2-6 2 2v4m-6-9 3-4 3 2 3 1',
  ai: 'M12 3v3m0 12v3M3 12h3m12 0h3M8 8l-2-2m10 2 2-2m-2 10 2 2m-10-2-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  body:
    'M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 18v-5a5 5 0 0 1 10 0v5M9 13l3 3 3-3',
  structure: 'M4 5h16M4 12h10M4 19h7m7-3v6m-3-3h6',
  guidance:
    'M9 18h6m-5 3h4m-7-9a5 5 0 1 1 10 0c0 2-1 3-2 4H9c-1-1-2-2-2-4Z',
  shield: 'M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4',
}

const features = [
  {
    title: 'Workout Planner',
    description:
      'Follow a clear seven-day split for focused training.',
    badge: "Today's Plan",
    cta: 'Open Workout Planner',
    to: '/workout',
    icon: icons.workout,
    style: 'bg-[#12351f] text-white',
    badgeStyle: 'bg-[#75ff38] text-black',
    iconStyle: 'bg-[#75ff38] text-black',
    linkStyle: 'text-[#75ff38]',
  },
  {
    title: 'Diet Report',
    description:
      'Shape practical nutrition targets around your inputs.',
    badge: 'Personalized',
    cta: 'Create Diet Report',
    to: '/diet-report',
    icon: icons.diet,
    style: 'bg-[#fff9d8] text-[#12351f]',
    badgeStyle: 'bg-[#ffdd33] text-black',
    iconStyle: 'bg-white text-[#12351f]',
    linkStyle: 'text-[#12351f]',
  },
  {
    title: 'Pedometer',
    description:
      'Keep everyday movement visible with simple step tracking.',
    badge: 'Daily Tracking',
    cta: 'Open Pedometer',
    to: '/pedometer',
    icon: icons.steps,
    style: 'bg-white text-[#12351f]',
    badgeStyle: 'bg-[#eefbe8] text-green-800',
    iconStyle: 'bg-[#12351f] text-white',
    linkStyle: 'text-green-800',
  },
  {
    title: 'Health AI',
    description:
      'Get practical answers for training, food, and recovery.',
    badge: 'Hybrid Guidance',
    cta: 'Ask Health AI',
    to: '/health-ai',
    icon: icons.ai,
    style: 'bg-gradient-to-br from-[#194a2c] to-[#07180d] text-white',
    badgeStyle: 'bg-[#ffdd33] text-black',
    iconStyle: 'bg-[#ffdd33] text-black',
    linkStyle: 'text-[#ffdd33]',
  },
]

const benefits = [
  {
    title: 'Structured Training',
    description: 'Know what to train each day and why it matters.',
    icon: icons.structure,
  },
  {
    title: 'Personalized Nutrition',
    description: 'Get useful targets shaped by your current inputs.',
    icon: icons.diet,
  },
  {
    title: 'Daily Activity Tracking',
    description: 'Keep everyday movement simple and visible.',
    icon: icons.steps,
  },
  {
    title: 'Smart Fitness Guidance',
    description: 'Find practical answers without losing focus.',
    icon: icons.guidance,
  },
]

function Icon({ path, className = 'h-5 w-5' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  )
}

function ActionLink({ children, className = '', to }) {
  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none ${className}`}
      to={to}
    >
      {children}
    </Link>
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

  const dailyItems = [
    {
      label: "Today's Workout",
      value: currentWorkout.rest ? 'Rest and recover' : currentWorkout.split,
      action: currentWorkout.rest ? 'View recovery day' : 'View today’s plan',
      to: '/workout',
      icon: icons.workout,
    },
    {
      label: "Today's Steps",
      value: pedometer.steps ? `${formattedSteps} steps` : 'No steps recorded',
      action: pedometer.steps ? 'Open step tracker' : 'Start walking',
      to: '/pedometer',
      icon: icons.steps,
    },
    {
      label: 'Nutrition Status',
      value: 'Report not saved',
      action: 'Create report',
      to: '/diet-report',
      icon: icons.diet,
    },
    {
      label: 'Body Check',
      value: 'BMI not saved',
      action: 'Calculate BMI',
      to: '/health-ai',
      icon: icons.body,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1400px] overflow-x-clip px-3 pb-28 pt-10 sm:px-6 sm:pb-32 sm:pt-14 lg:px-12 lg:pb-20 lg:pt-16 xl:px-16">
      <header className="relative isolate flex min-h-[420px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#12351f] via-[#0d2b19] to-[#07150c] px-5 py-12 shadow-2xl shadow-black/30 sm:min-h-[460px] sm:px-10 sm:py-16 lg:min-h-[500px] lg:px-14 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute -left-28 bottom-[-10rem] h-80 w-80 rounded-full bg-[#75ff38]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#75ff38]/10 blur-3xl"
        />

        <div className="relative grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#75ff38]">
              Welcome back <span className="mx-2 text-white/30">/</span>{' '}
              {formattedDate}
            </p>
            <h1 className="mt-6 max-w-3xl text-[2.65rem] font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Build better habits.
              <span className="mt-2 block text-[#75ff38]">
                Train with purpose.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-sm font-semibold leading-6 text-white/60 sm:text-base sm:leading-7">
              Your workout, nutrition, daily movement, and fitness guidance—all
              focused on what you can do today.
            </p>
            <div className="mt-10 flex flex-col gap-3 min-[380px]:flex-row">
              <ActionLink
                className="bg-[#75ff38] text-black hover:bg-[#8dff5f]"
                to="/workout"
              >
                Start Today&apos;s Workout
                <Icon className="h-4 w-4" path={icons.arrow} />
              </ActionLink>
              <ActionLink
                className="border border-white/20 bg-white/5 text-white hover:bg-white/10"
                to="/health-ai"
              >
                Ask Health AI
              </ActionLink>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative hidden min-h-[360px] items-center justify-center lg:flex"
          >
            <div className="absolute h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute h-64 w-64 rounded-full border-[18px] border-[#75ff38]/15 border-r-[#75ff38]" />
            <div className="absolute h-48 w-48 rotate-45 rounded-[3rem] border border-white/10 bg-white/[0.035]" />
            <div className="absolute left-10 top-8 h-3 w-3 rounded-full bg-[#ffdd33] shadow-[0_0_28px_8px_rgba(255,221,51,0.35)]" />
            <div className="absolute bottom-14 right-6 h-4 w-4 rounded-full bg-[#75ff38] shadow-[0_0_32px_10px_rgba(117,255,56,0.3)]" />
            <div className="relative flex h-32 w-32 rotate-6 items-center justify-center rounded-[2.5rem] bg-[#75ff38] text-black shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <Icon className="h-16 w-16 -rotate-6" path={icons.workout} />
            </div>
            <span className="absolute bottom-5 left-8 rounded-full border border-white/10 bg-black/40 px-5 py-3 text-xs font-black uppercase tracking-wider text-white backdrop-blur">
              Today · {currentWorkout.rest ? 'Recover' : currentWorkout.split}
            </span>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="today-glance"
        className="mt-14 sm:mt-16"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#75ff38]">
            Daily focus
          </p>
          <h2
            className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl"
            id="today-glance"
          >
            Today at a glance
          </h2>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {dailyItems.map((item) => (
            <Link
              className="group flex min-h-52 min-w-0 flex-col justify-between rounded-[1.5rem] border border-white/10 bg-[#0d1811] p-5 text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-[#75ff38]/50 hover:bg-[#102016] hover:shadow-[0_18px_50px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75ff38] motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
              key={item.label}
              to={item.to}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#75ff38] text-black transition duration-300 group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none">
                <Icon className="h-7 w-7" path={item.icon} />
              </span>
              <span className="mt-7 min-w-0">
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-white/40">
                  {item.label}
                </span>
                <span className="mt-2 block break-words text-xl font-black leading-tight">
                  {item.value}
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-black text-[#75ff38]">
                  {item.action}{' '}
                  <Icon className="h-3.5 w-3.5" path={icons.arrow} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="core-features" className="mt-16 sm:mt-20">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Your fitness toolkit
          </p>
          <h2
            className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl"
            id="core-features"
          >
            Four ways to move forward
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
            Choose the part of your routine that needs attention today.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <Link
              className={`group relative flex min-h-[340px] flex-col overflow-hidden rounded-[2rem] border border-transparent p-6 shadow-xl shadow-black/15 transition duration-300 hover:-translate-y-1.5 hover:border-[#75ff38]/60 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75ff38] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[380px] sm:p-8 ${feature.style}`}
              key={feature.title}
              to={feature.to}
            >
              <div
                aria-hidden="true"
                className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[2.5rem] border-current opacity-[0.06] transition duration-500 group-hover:scale-110 motion-reduce:transform-none"
              />
              <div className="relative flex items-start justify-between gap-4">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] transition duration-300 group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none ${feature.iconStyle}`}
                >
                  <Icon className="h-8 w-8" path={feature.icon} />
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${feature.badgeStyle}`}
                >
                  {feature.badge}
                </span>
              </div>
              <div className="relative mt-auto max-w-md pt-12">
                <h3 className="text-3xl font-black">{feature.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 opacity-65">
                  {feature.description}
                </p>
                <span
                  className={`mt-6 inline-flex min-h-11 items-center gap-2 py-2 text-sm font-black ${feature.linkStyle}`}
                >
                  {feature.cta}
                  <Icon className="h-4 w-4" path={icons.arrow} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="weekly-routine"
        className="mt-16 border-y border-white/10 py-14 sm:mt-20 sm:py-16"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
              Your training week
            </p>
            <h2
              className="mt-2 text-3xl font-black text-white sm:text-4xl"
              id="weekly-routine"
            >
              Weekly routine
            </h2>
          </div>
          <ActionLink
            className="w-fit border border-white/15 bg-white/5 text-white hover:bg-white/10"
            to="/workout"
          >
            View Full Workout Plan
          </ActionLink>
        </div>

        <div className="relative mt-10 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-4 lg:grid-cols-7 lg:gap-4">
          <div
            aria-hidden="true"
            className="absolute left-[7%] right-[7%] top-7 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent lg:block"
          />
          {workoutDays.map((day, index) => {
            const isToday = index === mondayIndex

            return (
              <article
                aria-current={isToday ? 'date' : undefined}
                className={`relative min-w-0 px-2 py-1 text-center ${
                  isToday
                    ? 'text-white lg:-translate-y-2'
                    : day.rest
                      ? 'text-[#ffdd33]'
                      : 'text-white'
                }`}
                key={day.day}
              >
                <span
                  className={`relative z-10 mx-auto flex items-center justify-center rounded-full border-4 border-[#050805] font-black ${
                    isToday
                      ? 'h-16 w-16 bg-[#75ff38] text-lg text-black shadow-[0_0_35px_rgba(117,255,56,0.3)]'
                      : day.rest
                        ? 'h-14 w-14 bg-[#ffdd33]/15 text-[#ffdd33]'
                        : 'h-14 w-14 bg-[#14261a] text-white/65'
                  }`}
                >
                  {index + 1}
                </span>
                <p
                  className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-current opacity-50"
                >
                  {weekLabels[index]}
                </p>
                <p className="mt-1 break-words text-sm font-black leading-5">
                  {day.rest ? 'Rest' : day.split}
                </p>
                {isToday && (
                  <span className="mt-2 inline-block text-[9px] font-black uppercase tracking-[0.18em] text-[#75ff38]">
                    Today
                  </span>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section
        aria-labelledby="why-fit-minds"
        className="mt-16 sm:mt-20"
      >
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Why Fit Minds
          </p>
          <h2
            className="mt-2 text-3xl font-black text-white sm:text-4xl"
            id="why-fit-minds"
          >
            Less guesswork. More direction.
          </h2>
        </div>
        <div className="mt-8 grid gap-7 border-y border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {benefits.map((benefit) => (
            <article className="flex gap-4" key={benefit.title}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#75ff38]/10 text-[#75ff38]">
                <Icon className="h-6 w-6" path={benefit.icon} />
              </span>
              <div>
                <h3 className="text-sm font-black text-white">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-white/45">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="mx-auto mt-12 flex max-w-4xl items-start justify-center gap-3 text-white/55 sm:mt-16">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ffdd33] text-black">
          <Icon path={icons.shield} />
        </span>
        <div>
          <p className="text-sm font-black text-white">Wellness note</p>
          <p className="mt-1 text-xs font-semibold leading-5 sm:text-sm">
            Fit Minds provides general fitness and wellness guidance. For
            medical concerns, consult a qualified healthcare professional.
          </p>
        </div>
      </aside>
    </div>
  )
}

export default Home
