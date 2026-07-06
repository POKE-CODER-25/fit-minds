import { Link } from 'react-router-dom'

const reportStats = [
  { label: 'Goal', value: 'Profile Based' },
  { label: 'Daily Calories', value: '2,400 kcal' },
  { label: 'Protein Target', value: '120 g' },
  { label: 'Hydration Goal', value: '3 L' },
  { label: 'Diet Style', value: 'Balanced' },
]

const suggestedFoods = [
  {
    name: 'Egg',
    category: 'Protein',
    serving: '1-2 whole eggs',
    whyUseful: 'Simple protein for recovery and daily meal structure.',
    type: 'Non-Veg',
  },
  {
    name: 'Chicken Breast',
    category: 'Lean Protein',
    serving: '100 g cooked',
    whyUseful: 'High-protein option that fits muscle-focused meals.',
    type: 'Non-Veg',
  },
  {
    name: 'Rice',
    category: 'Carbs',
    serving: '1 cup cooked',
    whyUseful: 'Practical energy source for lunch or post-workout meals.',
    type: 'Veg',
  },
  {
    name: 'Paneer',
    category: 'Protein',
    serving: '100 g',
    whyUseful: 'Vegetarian protein option for Indian meals.',
    type: 'Veg',
  },
  {
    name: 'Banana',
    category: 'Fast Energy',
    serving: '1 medium banana',
    whyUseful: 'Portable pre-workout carb with easy digestion.',
    type: 'Veg',
  },
  {
    name: 'Coconut Water',
    category: 'Hydration',
    serving: '1 cup',
    whyUseful: 'Light hydration support after sweating or walking.',
    type: 'Veg',
  },
]

const meals = [
  {
    name: 'Breakfast',
    structure: 'Protein + Carbs',
    accent: 'bg-[#75ff38] text-black',
  },
  {
    name: 'Lunch',
    structure: 'Protein + Rice/Carbs + Fiber',
    accent: 'bg-[#ffdd33] text-black',
  },
  {
    name: 'Pre-workout',
    structure: 'Fast energy food',
    accent: 'bg-[#12351f] text-white',
  },
  {
    name: 'Post-workout',
    structure: 'Protein + Carbs',
    accent: 'bg-[#75ff38] text-black',
  },
  {
    name: 'Dinner',
    structure: 'Light protein + vegetables',
    accent: 'bg-[#ffdd33] text-black',
  },
]

const foodTypeStyles = {
  Veg: 'bg-[#f7fff2] text-[#12351f]',
  'Non-Veg': 'bg-[#fff9d8] text-[#12351f]',
}

function DietReport() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Static Nutrition Prototype
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Diet Suggestion Report
        </h1>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/72">
          Personalized nutrition direction will be generated from your fitness
          profile in the real version.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f] shadow-lg shadow-black/10 sm:p-6">
        <h2 className="text-lg font-black">Nutrition Safety Disclaimer</h2>
        <p className="mt-2 text-sm font-semibold leading-6">
          Fit Minds provides general nutrition guidance only. This is not a
          medical prescription. If you have diabetes, kidney disease, heart
          problems, allergies, digestive issues, or any medical condition,
          consult a qualified doctor or dietitian before changing your diet.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
              Prototype Report
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Summary Direction
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#75ff38] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black">
            Static Data
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {reportStats.map((stat) => (
            <article
              className="rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20"
              key={stat.label}
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-black leading-tight text-[#12351f]">
                {stat.value}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
          Suggested Food Direction
        </p>
        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          Visual Food Cards
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {suggestedFoods.map((food) => (
            <article
              className="overflow-hidden rounded-3xl bg-white text-black shadow-xl shadow-black/20"
              key={food.name}
            >
              <div className="bg-[#12351f] p-5 text-white">
                <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#75ff38]/35 bg-black p-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
                      Food Visual
                    </p>
                    <span className="rounded-full bg-[#ffdd33] px-3 py-1 text-xs font-black text-black">
                      {food.category}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-[0.65fr_1fr] items-end gap-3">
                    <div className="h-20 rounded-full border-4 border-[#75ff38] bg-white/12" />
                    <div>
                      <div className="h-12 rounded-2xl bg-[#75ff38]" />
                      <div className="mt-3 h-3 rounded-full bg-[#ffdd33]" />
                    </div>
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
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${foodTypeStyles[food.type]}`}
                  >
                    {food.type}
                  </span>
                </div>
                <div className="mt-5 rounded-2xl border border-[#12351f]/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
                    Why Useful
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-black/65">
                    {food.whyUseful}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
          Meal Structure Preview
        </p>
        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          Prototype Day Layout
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {meals.map((meal) => (
            <article
              className="rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20"
              key={meal.name}
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${meal.accent}`}
              >
                {meal.name}
              </span>
              <p className="mt-5 text-xl font-black leading-snug text-[#12351f]">
                {meal.structure}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          className="rounded-3xl bg-[#75ff38] p-5 text-black shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#8fff5f] sm:p-6"
          to="/profile"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/55">
            Fitness Inputs
          </p>
          <p className="mt-2 text-2xl font-black">Edit Fitness Profile</p>
        </Link>
        <Link
          className="rounded-3xl border border-[#75ff38]/30 bg-white p-5 text-[#12351f] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#f7fff2] sm:p-6"
          to="/diet"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
            Food Categories
          </p>
          <p className="mt-2 text-2xl font-black">Explore Diet Flowchart</p>
        </Link>
      </div>
    </section>
  )
}

export default DietReport
