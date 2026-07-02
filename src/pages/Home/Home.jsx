import { Link } from 'react-router-dom'
import DashboardPrototypeCard from '../../components/DashboardPrototypeCard.jsx'
import FeatureCard from '../../components/FeatureCard.jsx'

const features = [
  {
    title: 'Pedometer',
    description: 'Open the step tracking prototype interface.',
    to: '/pedometer',
  },
  {
    title: 'Workout',
    description: 'Review the workout planning prototype area.',
    to: '/workout',
  },
  {
    title: 'Diet',
    description: 'Explore nutrition direction in prototype form.',
    to: '/diet',
  },
  {
    title: 'Diet Report',
    description: 'View the placeholder diet report experience.',
    to: '/diet-report',
  },
  {
    title: 'Health AI',
    description: 'Open the prototype health assistant space.',
    to: '/health-ai',
  },
]

function Home() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-2xl bg-white p-6 text-black shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#75ff38]">
              Prototype Version
            </p>
            <h1 className="mt-3 text-3xl font-black text-[#12351f] sm:text-4xl">
              Welcome back to Fit Minds
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-black/65">
              Your fitness, nutrition, and health companion.
            </p>
          </div>

          <Link
            className="rounded-2xl border border-[#12351f]/10 bg-[#f7fff2] px-5 py-4 font-black text-[#12351f] shadow-sm transition hover:bg-[#eaffdf]"
            to="/profile"
          >
            Review Profile
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <DashboardPrototypeCard />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            description={feature.description}
            key={feature.to}
            title={feature.title}
            to={feature.to}
          />
        ))}
      </div>

      <aside className="mt-6 rounded-2xl border border-[#ffdd33]/45 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10">
        <h2 className="text-lg font-black">Safety Reminder</h2>
        <p className="mt-2 text-sm font-semibold leading-6">
          Fit Minds provides general fitness guidance only. If you have any
          medical condition or are above 50, consult a qualified healthcare
          professional before following workout or diet suggestions.
        </p>
      </aside>
    </section>
  )
}

export default Home
