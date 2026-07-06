import { useMemo, useState } from 'react'
import { nutritionCategories } from '../../data/foodData.js'

const rankStyles = {
  S: 'bg-[#75ff38] text-black',
  A: 'bg-[#ffdd33] text-black',
  B: 'bg-[#12351f] text-white',
}

const foodTypeStyles = {
  Veg: 'bg-[#f7fff2] text-[#12351f]',
  'Non-Veg': 'bg-[#fff9d8] text-[#12351f]',
}

function Diet() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    nutritionCategories[0].id,
  )

  const selectedCategory = useMemo(
    () =>
      nutritionCategories.find(
        (category) => category.id === selectedCategoryId,
      ) ?? nutritionCategories[0],
    [selectedCategoryId],
  )

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Prototype Nutrition Map
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Nutrition Flowchart
        </h1>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/72">
          Explore food categories visually before using personalized diet
          reports.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10 sm:p-6">
        <h2 className="text-lg font-black">Diet Safety Note</h2>
        <p className="mt-2 text-sm font-semibold leading-6">
          Fit Minds does not provide medical diet prescriptions. If you have
          diabetes, kidney disease, heart problems, allergies, digestive issues,
          or any medical condition, consult a qualified doctor or dietitian
          before changing your diet.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2">
          {nutritionCategories.map((category) => {
            const isSelected = selectedCategory.id === category.id

            return (
              <button
                className={`min-h-44 rounded-3xl p-5 text-left shadow-xl shadow-black/20 transition ${
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
                    Prototype
                  </span>
                </div>
                <p
                  className={`mt-4 text-sm font-semibold leading-6 ${
                    isSelected ? 'text-black/70' : 'text-black/60'
                  }`}
                >
                  {category.description}
                </p>
                <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-[#12351f]">
                  View Foods <span aria-hidden="true">&rarr;</span>
                </p>
              </button>
            )
          })}
        </div>

        <article className="rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6 lg:sticky lg:top-24">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Selected Category Preview
          </p>
          <h2 className="mt-3 text-2xl font-black text-[#12351f]">
            {selectedCategory.name}
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-[#f7fff2] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                Why This Category Matters
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-black/65">
                {selectedCategory.why}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff9d8] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                Example Foods
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCategory.examples.map((food) => (
                  <span
                    className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#12351f] shadow-sm"
                    key={food}
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>

            <p className="rounded-2xl bg-[#12351f] p-4 text-sm font-bold leading-6 text-white">
              Ranked food cards will be expanded in the real version.
            </p>
          </div>
        </article>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
              Food Item Prototype Cards
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              {selectedCategory.name} Foods
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#75ff38] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black">
            Static Preview
          </span>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {selectedCategory.foods.map((food) => (
            <article
              className="overflow-hidden rounded-3xl bg-white text-black shadow-xl shadow-black/20"
              key={food.name}
            >
              <div className="bg-[#12351f] p-5 text-white">
                <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#75ff38]/35 bg-black p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
                    Food Visual
                  </p>
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
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-[#12351f]">
                      {food.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-black/55">
                      {food.serving}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${rankStyles[food.rank]}`}
                  >
                    Rank {food.rank}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f7fff2] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                      Calories
                    </p>
                    <p className="mt-2 font-black text-[#12351f]">
                      {food.calories}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#fff9d8] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                      Food Type
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${foodTypeStyles[food.type]}`}
                    >
                      {food.type}
                    </span>
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
                      Caution
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6">
                      {food.caution}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Diet
