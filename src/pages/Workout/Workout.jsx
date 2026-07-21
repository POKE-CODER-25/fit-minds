import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { workoutDays } from '../../data/workoutDays.js'

function Workout() {
  const [selectedDay, setSelectedDay] = useState(workoutDays[0])

  const selectedTitle = useMemo(
    () => `Day ${selectedDay.day}: ${selectedDay.split}`,
    [selectedDay],
  )

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Prototype Workout Planner
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Workout Flowchart
        </h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-white/72">
          Choose a training day and explore the muscle focus.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10 sm:p-6">
        <h2 className="text-lg font-black">Weekly Split Note</h2>
        <p className="mt-2 text-sm font-semibold leading-6">
          Cardio can be done in free time. Abs can be trained once per week by
          replacing biceps or triceps.
        </p>
      </div>

      <Link
        className="mt-6 flex rounded-3xl bg-white p-5 text-[#12351f] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#f7fff2] sm:p-6"
        to="/workout/exercises"
      >
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Exercise Database Prototype
          </p>
          <p className="mt-2 text-xl font-black">
            Open Exercise Rankings →
          </p>
        </div>
      </Link>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2">
          {workoutDays.map((workoutDay) => {
            const isSelected = selectedDay.day === workoutDay.day

            return (
              <button
                className={`min-h-48 rounded-3xl p-5 text-left shadow-xl shadow-black/20 transition ${
                  isSelected
                    ? 'bg-[#75ff38] text-black'
                    : 'bg-white text-black hover:-translate-y-0.5 hover:bg-[#f7fff2]'
                }`}
                key={workoutDay.day}
                onClick={() => setSelectedDay(workoutDay)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-black uppercase tracking-[0.16em] ${
                        isSelected ? 'text-black/60' : 'text-[#12351f]/55'
                      }`}
                    >
                      Day {workoutDay.day}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-[#12351f]">
                      {workoutDay.split}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#ffdd33] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                    Prototype
                  </span>
                </div>

                <p
                  className={`mt-4 text-sm font-semibold leading-6 ${
                    isSelected ? 'text-black/70' : 'text-black/60'
                  }`}
                >
                  {workoutDay.purpose}
                </p>
                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[#12351f]">
                  View Focus →
                </p>
              </button>
            )
          })}
        </div>

        <article className="rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6 lg:sticky lg:top-24">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Selected Day Preview
          </p>
          <h2 className="mt-3 text-2xl font-black text-[#12351f]">
            {selectedTitle}
          </h2>

          {selectedDay.rest ? (
            <div className="mt-6 rounded-2xl bg-[#f7fff2] p-5">
              <h3 className="text-xl font-black text-[#12351f]">
                Recovery day
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
                Walking, stretching, hydration, sleep
              </p>
              <p className="mt-4 rounded-2xl bg-[#fff9d8] p-4 text-sm font-black leading-6 text-[#12351f]">
                No heavy lifting recommendation
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#f7fff2] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                  Primary Muscles
                </p>
                <p className="mt-2 text-lg font-black text-[#12351f]">
                  {selectedDay.primary.join(', ')}
                </p>
              </div>
              <div className="rounded-2xl bg-[#fff9d8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                  Secondary Muscles
                </p>
                <p className="mt-2 text-lg font-black text-[#12351f]">
                  {selectedDay.secondary.join(', ')}
                </p>
              </div>
              <p className="text-sm font-semibold leading-6 text-black/60">
                Open rankings for this day&apos;s training muscles.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedDay.exerciseMuscles.map((muscle) => (
                  <Link
                    className="rounded-2xl bg-[#12351f] p-4 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1c4b2d]"
                    key={muscle}
                    to={`/workout/exercises?muscle=${encodeURIComponent(
                      muscle,
                    )}`}
                  >
                    <p className="text-sm font-black">
                      View {muscle} Exercises
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default Workout
