import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
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
    style:
      'bg-gradient-to-br from-[var(--color-forest-light)] to-[var(--color-forest-dark)] text-[var(--color-text-primary)]',
    badgeStyle: 'ui-badge--primary',
    iconStyle: 'bg-[var(--color-primary)] text-[var(--color-text-dark)]',
    linkStyle: 'text-[var(--color-primary)]',
  },
  {
    title: 'Diet Report',
    description:
      'Shape practical nutrition targets around your inputs.',
    badge: 'Personalized',
    cta: 'Create Diet Report',
    to: '/diet-report',
    icon: icons.diet,
    style:
      'border-[var(--color-border-light)] bg-[var(--color-surface-light)] text-[var(--color-text-dark)]',
    badgeStyle: 'ui-badge--recommended',
    iconStyle:
      'bg-[var(--color-surface-mint)] text-[var(--color-forest)]',
    linkStyle: 'text-[var(--color-forest)]',
  },
  {
    title: 'Pedometer',
    description:
      'Keep everyday movement visible with simple step tracking.',
    badge: 'Daily Tracking',
    cta: 'Open Pedometer',
    to: '/pedometer',
    icon: icons.steps,
    style:
      'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]',
    badgeStyle: 'ui-badge--neutral',
    iconStyle:
      'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
    linkStyle: 'text-[var(--color-primary)]',
  },
  {
    title: 'Health AI',
    description:
      'Get practical answers for training, food, and recovery.',
    badge: 'Hybrid Guidance',
    cta: 'Ask Health AI',
    to: '/health-ai',
    icon: icons.ai,
    style:
      'bg-gradient-to-br from-[var(--color-bg-soft)] to-[var(--color-forest-dark)] text-[var(--color-text-primary)]',
    badgeStyle: 'ui-badge--info',
    iconStyle:
      'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
    linkStyle: 'text-[var(--color-primary)]',
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
      tileStyle:
        'bg-[var(--color-forest)] text-[var(--color-text-primary)]',
      iconStyle:
        'bg-[var(--color-primary)] text-[var(--color-text-dark)]',
    },
    {
      label: "Today's Steps",
      value: pedometer.steps ? `${formattedSteps} steps` : 'No steps recorded',
      action: pedometer.steps ? 'Open step tracker' : 'Start walking',
      to: '/pedometer',
      icon: icons.steps,
      tileStyle:
        'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]',
      iconStyle:
        'bg-[var(--color-primary-soft)] text-[var(--color-primary)]',
    },
    {
      label: 'Nutrition Status',
      value: 'Report not saved',
      action: 'Create report',
      to: '/diet-report',
      icon: icons.diet,
      tileStyle:
        'border-[var(--color-border-light)] bg-[var(--color-surface-mint)] text-[var(--color-text-dark)]',
      iconStyle:
        'bg-[var(--color-forest)] text-[var(--color-surface-light)]',
      light: true,
    },
    {
      label: 'Body Check',
      value: 'BMI not saved',
      action: 'Calculate BMI',
      to: '/health-ai',
      icon: icons.body,
      tileStyle:
        'bg-[var(--color-bg-soft)] text-[var(--color-text-primary)]',
      iconStyle:
        'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
    },
  ]

  return (
    <div className="app-container page-shell overflow-x-clip">
      <header className="relative isolate flex min-h-[440px] overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--color-forest-light)] via-[var(--color-forest)] to-[var(--color-forest-dark)] px-5 py-10 shadow-[var(--shadow-floating)] sm:min-h-[500px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div
          aria-hidden="true"
          className="absolute -left-28 bottom-[-10rem] h-80 w-80 rounded-full bg-[var(--color-primary-soft)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[var(--color-primary-soft)] blur-3xl"
        />

        <div className="relative grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="type-label font-extrabold text-[var(--color-primary)]">
              Welcome back <span className="mx-2 text-white/30">/</span>{' '}
              {formattedDate}
            </p>
            <h1 className="type-display mt-6 max-w-3xl text-[var(--color-text-primary)]">
              Build better habits.
              <span className="mt-2 block text-[var(--color-primary)]">
                Train with purpose.
              </span>
            </h1>
            <p className="type-body-large mt-7 max-w-xl text-[var(--color-text-secondary)]">
              Your workout, nutrition, daily movement, and fitness guidance—all
              focused on what you can do today.
            </p>
            <div className="mt-9 flex flex-col gap-3 min-[380px]:flex-row">
              <Button
                size="large"
                to="/workout"
              >
                Start Today&apos;s Workout
                <Icon className="h-4 w-4" path={icons.arrow} />
              </Button>
              <Button
                size="large"
                to="/health-ai"
                variant="secondary"
              >
                Ask Health AI
              </Button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative flex min-h-[230px] items-center justify-center sm:min-h-[280px] lg:min-h-[360px]"
          >
            <div className="absolute h-56 w-56 rounded-full border border-white/10 sm:h-72 sm:w-72 lg:h-80 lg:w-80" />
            <div className="absolute h-44 w-44 rounded-full border-[14px] border-[var(--color-primary-soft)] border-r-[var(--color-primary)] sm:h-56 sm:w-56 lg:h-64 lg:w-64 lg:border-[18px]" />
            <div className="absolute h-32 w-32 rotate-45 rounded-[2rem] border border-white/10 bg-white/[0.035] sm:h-44 sm:w-44 sm:rounded-[3rem] lg:h-48 lg:w-48" />
            <div className="absolute left-[12%] top-[12%] h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[var(--glow-accent)] sm:h-3 sm:w-3" />
            <div className="absolute bottom-[16%] right-[10%] h-3 w-3 rounded-full bg-[var(--color-primary)] shadow-[var(--glow-primary)] sm:h-4 sm:w-4" />
            <div className="relative flex h-24 w-24 rotate-6 items-center justify-center rounded-[2rem] bg-[var(--color-primary)] text-[var(--color-text-dark)] shadow-[var(--shadow-floating)] sm:h-28 sm:w-28 lg:h-32 lg:w-32 lg:rounded-[2.5rem]">
              <Icon className="h-12 w-12 -rotate-6 sm:h-14 sm:w-14 lg:h-16 lg:w-16" path={icons.workout} />
            </div>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black/45 px-4 py-2 text-xs font-extrabold text-white backdrop-blur sm:bottom-2 sm:px-5 sm:py-3">
              Today · {currentWorkout.rest ? 'Recover' : currentWorkout.split}
            </span>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="today-glance"
        className="section-shell"
      >
        <div className="max-w-2xl">
          <p className="type-eyebrow text-[var(--color-primary)]">
            Daily focus
          </p>
          <h2
            className="type-section-title mt-3 text-[var(--color-text-primary)]"
            id="today-glance"
          >
            Today at a glance
          </h2>
          <p className="type-body mt-3 text-[var(--color-text-secondary)]">
            Your workout, movement, and next health actions in one quick view.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dailyItems.map((item) => (
            <Link
              className={`group flex min-h-48 min-w-0 flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 shadow-[var(--shadow-surface)] transition duration-[var(--duration-standard)] ease-[var(--ease-out)] hover:-translate-y-[3px] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] motion-reduce:transform-none motion-reduce:transition-none sm:p-6 ${item.tileStyle}`}
              key={item.label}
              to={item.to}
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition duration-[var(--duration-standard)] group-hover:scale-105 motion-reduce:transform-none ${item.iconStyle}`}
              >
                <Icon className="h-7 w-7" path={item.icon} />
              </span>
              <span className="mt-6 min-w-0">
                <span
                  className={`type-label block ${
                    item.light
                      ? 'text-[var(--color-forest)]/65'
                      : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {item.label}
                </span>
                <span className="mt-2 block break-words text-xl font-black leading-tight">
                  {item.value}
                </span>
                <span
                  className={`mt-3 inline-flex items-center gap-2 text-xs font-extrabold ${
                    item.light
                      ? 'text-[var(--color-forest)]'
                      : 'text-[var(--color-primary)]'
                  }`}
                >
                  {item.action}{' '}
                  <Icon className="h-3.5 w-3.5" path={icons.arrow} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="core-features" className="section-shell">
        <div className="max-w-2xl">
          <p className="type-eyebrow text-[var(--color-primary)]">
            Your fitness toolkit
          </p>
          <h2
            className="type-section-title mt-3 text-[var(--color-text-primary)]"
            id="core-features"
          >
            Four ways to move forward
          </h2>
          <p className="type-body mt-3 text-[var(--color-text-secondary)]">
            Choose the part of your routine that needs attention today.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:gap-6">
          {features.map((feature) => (
            <Link
              className={`group relative flex min-h-[340px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 shadow-[var(--shadow-surface)] transition duration-[var(--duration-standard)] ease-[var(--ease-out)] hover:-translate-y-[3px] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] motion-reduce:transform-none motion-reduce:transition-none sm:min-h-[380px] sm:p-8 ${feature.style}`}
              key={feature.title}
              to={feature.to}
            >
              <div
                aria-hidden="true"
                className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-[2.5rem] border-current opacity-[0.06] transition duration-[var(--duration-slow)] group-hover:scale-105 motion-reduce:transform-none"
              />
              <Icon
                className="absolute right-7 top-24 h-28 w-28 opacity-[0.045] sm:h-36 sm:w-36"
                path={feature.icon}
              />
              <div className="relative flex items-start justify-between gap-4">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-lg)] transition duration-[var(--duration-standard)] group-hover:scale-105 motion-reduce:transform-none ${feature.iconStyle}`}
                >
                  <Icon className="h-8 w-8" path={feature.icon} />
                </span>
                <span
                  className={`ui-badge ${feature.badgeStyle}`}
                >
                  {feature.badge}
                </span>
              </div>
              <div className="relative mt-auto max-w-md pt-12">
                <h3 className="text-3xl font-black tracking-tight">
                  {feature.title}
                </h3>
                <p className="type-body-small mt-3 max-w-sm opacity-65">
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
        className="section-shell border-y border-[var(--color-border)] py-12 sm:py-16"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-eyebrow text-[var(--color-primary)]">
              Your training week
            </p>
            <h2
              className="type-section-title mt-3 text-[var(--color-text-primary)]"
              id="weekly-routine"
            >
              Weekly routine
            </h2>
          </div>
          <Button
            className="w-fit"
            to="/workout"
            variant="secondary"
          >
            View Full Workout Plan
          </Button>
        </div>

        <div className="relative mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 lg:grid-cols-7 lg:gap-4">
          <div
            aria-hidden="true"
            className="absolute left-[7%] right-[7%] top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent lg:block"
          />
          {workoutDays.map((day, index) => {
            const isToday = index === mondayIndex

            return (
              <article
                aria-current={isToday ? 'date' : undefined}
                className={`relative min-w-0 px-2 py-1 text-center ${
                  isToday
                    ? 'text-[var(--color-text-primary)]'
                    : day.rest
                      ? 'text-[var(--color-accent)]'
                      : 'text-[var(--color-text-primary)]'
                }`}
                key={day.day}
              >
                <span
                  className={`relative z-10 mx-auto flex items-center justify-center rounded-full border-4 border-[var(--color-bg)] font-black ${
                    isToday
                      ? 'h-16 w-16 bg-[var(--color-primary)] text-lg text-[var(--color-text-dark)] shadow-[var(--glow-primary)]'
                      : day.rest
                        ? 'h-14 w-14 bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                        : 'h-14 w-14 bg-[var(--color-bg-soft)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  {index + 1}
                </span>
                <p
                  className="type-caption mt-4 font-extrabold text-current opacity-55"
                >
                  {weekLabels[index]}
                </p>
                <p className="mt-1 break-words text-sm font-black leading-5">
                  {day.rest ? 'Rest' : day.split}
                </p>
                {isToday && (
                  <span className="ui-badge ui-badge--primary mt-2">
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
        className="section-shell"
      >
        <div className="max-w-xl">
          <p className="type-eyebrow text-[var(--color-primary)]">
            Why Fit Minds
          </p>
          <h2
            className="type-section-title mt-3 text-[var(--color-text-primary)]"
            id="why-fit-minds"
          >
            Less guesswork. More direction.
          </h2>
        </div>
        <div className="mt-9 grid gap-8 border-y border-[var(--color-border)] py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {benefits.map((benefit) => (
            <article className="flex gap-4" key={benefit.title}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Icon className="h-6 w-6" path={benefit.icon} />
              </span>
              <div>
                <h3 className="type-card-title text-[var(--color-text-primary)]">
                  {benefit.title}
                </h3>
                <p className="type-body-small mt-2 text-[var(--color-text-secondary)]">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="mx-auto mt-12 flex max-w-4xl items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-text-secondary)] shadow-[var(--shadow-surface)] sm:mt-16 sm:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
          <Icon path={icons.shield} />
        </span>
        <div>
          <p className="type-label text-[var(--color-text-primary)]">
            Wellness note
          </p>
          <p className="type-body-small mt-1">
            Fit Minds provides general fitness and wellness guidance. For
            medical concerns, consult a qualified healthcare professional.
          </p>
        </div>
      </aside>
    </div>
  )
}

export default Home
