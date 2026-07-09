import { useMemo, useState } from 'react'
import { dietTypes, foodCategories, foods } from '../../data/foodData.js'

const rankStyles = {
  S: 'bg-[#75ff38] text-black',
  A: 'bg-[#ffdd33] text-black',
  B: 'bg-[#12351f] text-white',
}

const dietTypeStyles = {
  Vegetarian: 'bg-[#f7fff2] text-[#12351f]',
  Eggitarian: 'bg-[#fff9d8] text-[#12351f]',
  'Non Vegetarian': 'bg-[#12351f] text-white',
}

function Diet() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    foodCategories[0].id,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [rankFilter, setRankFilter] = useState('All')
  const [dietTypeFilter, setDietTypeFilter] = useState('All')

  const selectedCategory = useMemo(
    () =>
      foodCategories.find((category) => category.id === selectedCategoryId) ??
      foodCategories[0],
    [selectedCategoryId],
  )

  const selectedCategoryFoods = useMemo(
    () => foods.filter((food) => food.category === selectedCategory.name),
    [selectedCategory.name],
  )

  const filteredFoods = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return selectedCategoryFoods.filter((food) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [food.name, food.category, food.whyUseful].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        )
      const matchesRank = rankFilter === 'All' || food.rank === rankFilter
      const matchesDietType =
        dietTypeFilter === 'All' || food.dietType === dietTypeFilter

      return matchesSearch && matchesRank && matchesDietType
    })
  }, [dietTypeFilter, rankFilter, searchTerm, selectedCategoryFoods])

  const resetFilters = () => {
    setSearchTerm('')
    setRankFilter('All')
    setDietTypeFilter('All')
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Static Nutrition Map
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Nutrition Flowchart
        </h1>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/72">
          Explore local food rankings by category, diet type, and training use.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10 sm:p-6">
          <h2 className="text-lg font-black">Food Ranking Note</h2>
          <p className="mt-2 text-sm font-semibold leading-6">
            Food rankings are for general fitness and nutrition education. Exact
            diet choices depend on your body, medical history, allergies,
            budget, and doctor/dietitian advice.
          </p>
        </div>

        <div className="rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10 sm:p-6">
          <h2 className="text-lg font-black">Diet Safety Note</h2>
          <p className="mt-2 text-sm font-semibold leading-6">
            Fit Minds does not provide medical diet prescriptions. If you have
            diabetes, kidney disease, heart problems, allergies, digestive
            issues, or any medical condition, consult a qualified doctor or
            dietitian before changing your diet.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {foodCategories.map((category) => {
          const isSelected = selectedCategory.id === category.id

          return (
            <button
              className={`min-h-40 rounded-3xl p-5 text-left shadow-xl shadow-black/20 transition ${
                isSelected
                  ? 'bg-[#75ff38] text-black'
                  : 'bg-white text-black hover:-translate-y-0.5 hover:bg-[#f7fff2]'
              }`}
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black text-[#12351f]">
                  {category.name}
                </h2>
                <span className="shrink-0 rounded-full bg-[#ffdd33] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                  {foods.filter((food) => food.category === category.name).length}
                </span>
              </div>
              <p
                className={`mt-4 text-sm font-semibold leading-6 ${
                  isSelected ? 'text-black/70' : 'text-black/60'
                }`}
              >
                {category.description}
              </p>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#12351f]">
                View Foods <span aria-hidden="true">&rarr;</span>
              </p>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 text-[#12351f] shadow-xl shadow-black/15 sm:p-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
              Selected Category
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {selectedCategory.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-black/65">
              {selectedCategory.why}
            </p>
          </div>
          <button
            className="w-fit rounded-2xl bg-[#12351f] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#1c4b2d]"
            onClick={resetFilters}
            type="button"
          >
            Reset Filters
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_150px_220px] lg:items-end">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Search
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-bold text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Food, category, benefit"
              type="search"
              value={searchTerm}
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Rank
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) => setRankFilter(event.target.value)}
              value={rankFilter}
            >
              <option value="All">All</option>
              <option value="S">S</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Diet Type
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#fff9d8] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) => setDietTypeFilter(event.target.value)}
              value={dietTypeFilter}
            >
              <option value="All">All</option>
              {dietTypes.map((dietType) => (
                <option key={dietType} value={dietType}>
                  {dietType}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
              Static Food Database
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {selectedCategory.name} Foods
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#75ff38] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black">
            {filteredFoods.length} shown
          </span>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredFoods.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-[#12351f] shadow-xl shadow-black/20 md:col-span-2 xl:col-span-3">
              <p className="text-lg font-black">
                No foods found for this filter.
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
            filteredFoods.map((food) => (
              <article
                className="overflow-hidden rounded-3xl bg-white text-black shadow-xl shadow-black/20"
                key={food.id}
              >
                <div className="bg-[#12351f] p-5 text-white">
                  <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#75ff38]/35 bg-black p-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
                        Food Visual
                      </p>
                      <p className="mt-3 text-xl font-black">
                        {food.imagePlaceholderLabel}
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-[1fr_0.35fr] items-end gap-3">
                      <div>
                        <div className="h-12 rounded-2xl bg-[#75ff38]" />
                        <div className="mt-3 h-3 rounded-full bg-[#ffdd33]" />
                      </div>
                      <div className="h-20 rounded-full border-4 border-[#75ff38] bg-white/12" />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-black text-[#12351f]">
                          {food.name}
                        </h3>
                        <span className="mt-2 inline-flex rounded-full bg-[#f7fff2] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#12351f]">
                          {food.category}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${rankStyles[food.rank]}`}
                      >
                        Rank {food.rank}
                      </span>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${dietTypeStyles[food.dietType]}`}
                    >
                      {food.dietType}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f7fff2] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                        Calories
                      </p>
                      <p className="mt-2 font-black text-[#12351f]">
                        {food.caloriesPerServing}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#fff9d8] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                        Serving Example
                      </p>
                      <p className="mt-2 text-sm font-black leading-5 text-[#12351f]">
                        {food.servingExample}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-[#12351f]/10 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                        Why Useful
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-black/65">
                        {food.whyUseful}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#12351f] p-4 text-white">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#75ff38]">
                        Caution Note
                      </p>
                      <p className="mt-2 text-sm font-bold leading-6">
                        {food.cautionNote}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default Diet
