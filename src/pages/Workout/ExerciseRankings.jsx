import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { exercises, muscleGroups } from '../../data/exerciseData.js'

const tierStyles = {
  S: 'bg-[#75ff38] text-black',
  A: 'bg-[#ffdd33] text-black',
  B: 'bg-[#12351f] text-white',
}

function ExerciseRankings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const muscleQuery = searchParams.get('muscle')
  const initialMuscle = muscleGroups.includes(muscleQuery)
    ? muscleQuery
    : muscleGroups[0]

  const [selectedMuscle, setSelectedMuscle] = useState(initialMuscle)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [beginnerFilter, setBeginnerFilter] = useState('All')

  const selectedExercises = useMemo(
    () => {
      const normalizedSearch = searchTerm.trim().toLowerCase()

      return exercises.filter((exercise) => {
        const matchesMuscle = exercise.muscleGroup === selectedMuscle
        const matchesTier =
          tierFilter === 'All' || exercise.tier === tierFilter
        const matchesBeginner =
          beginnerFilter === 'All' || exercise.beginnerRecommended
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [exercise.name, exercise.primaryMuscle, exercise.equipment].some(
            (value) => value.toLowerCase().includes(normalizedSearch),
          )

        return (
          matchesMuscle && matchesTier && matchesBeginner && matchesSearch
        )
      })
    },
    [beginnerFilter, searchTerm, selectedMuscle, tierFilter],
  )

  useEffect(() => {
    if (muscleGroups.includes(muscleQuery) && muscleQuery !== selectedMuscle) {
      setSelectedMuscle(muscleQuery)
    }
  }, [muscleQuery, selectedMuscle])

  const handleMuscleChange = (muscleGroup) => {
    setSelectedMuscle(muscleGroup)
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.set('muscle', muscleGroup)
      return nextParams
    })
  }

  const resetFilters = () => {
    setSearchTerm('')
    setTierFilter('All')
    setBeginnerFilter('All')
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Static Exercise Database
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Exercise Rankings
        </h1>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/72">
          Explore classic exercises ranked by training value, beginner safety,
          and muscle focus.
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
        {muscleGroups.map((muscleGroup) => {
          const isSelected = muscleGroup === selectedMuscle

          return (
            <button
              className={`min-w-32 rounded-2xl px-4 py-3 text-sm font-black transition ${
                isSelected
                  ? 'bg-[#75ff38] text-black shadow-lg shadow-[#75ff38]/20'
                  : 'bg-white text-[#12351f] shadow-lg shadow-black/15 hover:bg-[#f7fff2]'
              }`}
              key={muscleGroup}
              onClick={() => handleMuscleChange(muscleGroup)}
              type="button"
            >
              {muscleGroup}
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid gap-3 rounded-3xl bg-white p-4 text-[#12351f] shadow-lg shadow-black/15 md:grid-cols-[1fr_160px_240px] md:items-end">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
            Search
          </span>
          <input
            className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-bold text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Name, muscle, equipment"
            type="search"
            value={searchTerm}
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
            Tier
          </span>
          <select
            className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
            onChange={(event) => setTierFilter(event.target.value)}
            value={tierFilter}
          >
            <option value="All">All</option>
            <option value="S">S</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
            Beginner
          </span>
          <select
            className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#fff9d8] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
            onChange={(event) => setBeginnerFilter(event.target.value)}
            value={beginnerFilter}
          >
            <option value="All">All exercises</option>
            <option value="Beginner">Beginner recommended only</option>
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10">
        <p className="text-sm font-semibold leading-6">
          Fit Minds ranks exercises for general training value and beginner
          usability. Always learn proper form before lifting heavy.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {selectedExercises.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center text-[#12351f] shadow-xl shadow-black/20 lg:col-span-2">
            <p className="text-lg font-black">
              No exercises found for this filter.
            </p>
            <button
              className="mt-4 rounded-2xl bg-[#75ff38] px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-[#89ff58]"
              onClick={resetFilters}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          selectedExercises.map((exercise) => (
          <article
            className="overflow-hidden rounded-3xl bg-white text-black shadow-xl shadow-black/20"
            key={exercise.id}
          >
            <div className="bg-[#12351f] p-5 text-white">
              <div className="flex min-h-44 flex-col justify-between rounded-2xl border border-[#75ff38]/35 bg-black p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
                    Target Muscle Visual
                  </p>
                  <p className="mt-3 text-2xl font-black">
                    {exercise.imagePlaceholderLabel}
                  </p>
                </div>
                <div className="mt-6 h-3 rounded-full bg-[#75ff38]" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <span className="h-2 rounded-full bg-[#ffdd33]" />
                  <span className="h-2 rounded-full bg-white/45" />
                  <span className="h-2 rounded-full bg-[#75ff38]/55" />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#12351f]">
                    {exercise.name}
                  </h2>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.14em] text-[#12351f]/55">
                    {exercise.muscleGroup}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${tierStyles[exercise.tier]}`}
                  >
                    Tier {exercise.tier}
                  </span>
                  {exercise.beginnerRecommended && (
                    <span className="rounded-full bg-[#fff9d8] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#12351f]">
                      Beginner Recommended
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f7fff2] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Difficulty
                  </p>
                  <p className="mt-2 font-black text-[#12351f]">
                    {exercise.difficulty}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7fff2] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Primary Muscle
                  </p>
                  <p className="mt-2 font-black text-[#12351f]">
                    {exercise.primaryMuscle}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#fff9d8] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Secondary Muscles
                  </p>
                  <p className="mt-2 font-black text-[#12351f]">
                    {exercise.secondaryMuscles.join(', ')}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#fff9d8] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Equipment
                  </p>
                  <p className="mt-2 font-black text-[#12351f]">
                    {exercise.equipment}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-[#12351f]/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Common Mistakes
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-black/65">
                    {exercise.commonMistakes}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#12351f]/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Professional Note
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-black/65">
                    {exercise.professionalNote}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#12351f] p-4 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#75ff38]">
                    YouTube Search Note
                  </p>
                  <p className="mt-2 text-sm font-bold leading-6">
                    Search on YouTube: "{exercise.youtubeSearchText}"
                  </p>
                </div>
              </div>
            </div>
          </article>
          ))
        )}
      </div>
    </section>
  )
}

export default ExerciseRankings
