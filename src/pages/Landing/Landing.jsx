import { Link } from 'react-router-dom'

const features = ['Pedometer', 'Workout Guide', 'Diet Guide', 'Health AI']

function Landing() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="rounded-3xl bg-[#12351f] p-7 shadow-2xl shadow-black/30 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
            Prototype Version
          </p>
          <h1 className="mt-5 text-5xl font-black leading-tight text-white sm:text-6xl">
            Fit Minds
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg">
            A mobile-first fitness and health prototype foundation for movement,
            workouts, diet guidance, and health AI experiences.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="rounded-2xl bg-[#75ff38] px-6 py-3 text-center font-black text-black shadow-lg shadow-[#75ff38]/20"
              to="/signup"
            >
              Get Started
            </Link>
            <Link
              className="rounded-2xl border border-white/20 bg-black px-6 py-3 text-center font-black text-white shadow-lg shadow-black/20"
              to="/login"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 text-black shadow-2xl shadow-black/25 sm:p-10">
          <h2 className="text-2xl font-black text-[#12351f]">Page Title</h2>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[#75ff38]">
            Prototype Version
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <article
                className="rounded-2xl border border-[#12351f]/10 bg-[#f7fff2] p-4 shadow-md shadow-black/10"
                key={feature}
              >
                <h3 className="text-base font-black text-[#12351f]">
                  {feature}
                </h3>
                <p className="mt-2 text-sm font-semibold text-black/55">
                  Prototype only
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
