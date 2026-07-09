import { useMemo, useState } from 'react'
import { foods } from '../../data/foodData.js'

const initialCredentials = {
  age: '25',
  gender: 'Male',
  heightCm: '170',
  weightKg: '70',
  fitnessGoal: 'Maintain Weight',
  activityLevel: 'Moderate',
  dietPreference: 'Vegetarian',
}

const activityFactors = {
  Sedentary: 1.2,
  Light: 1.375,
  Moderate: 1.55,
  Active: 1.725,
  Athlete: 1.9,
}

const goalAdjustments = {
  'Weight Loss': -500,
  'Maintain Weight': 0,
  'Muscle Gain': 300,
}

const proteinFactors = {
  'Weight Loss': 1.6,
  'Maintain Weight': 1.4,
  'Muscle Gain': 2,
}

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

const mealAccents = {
  Breakfast: 'bg-[#75ff38] text-black',
  Lunch: 'bg-[#ffdd33] text-black',
  'Pre-workout': 'bg-[#12351f] text-white',
  'Post-workout': 'bg-[#75ff38] text-black',
  Dinner: 'bg-[#ffdd33] text-black',
}

const goalCategoryPriority = {
  'Weight Loss': ['Protein', 'Fiber', 'Hydration', 'Vitamins & Minerals'],
  'Maintain Weight': [
    'Protein',
    'Carbohydrates',
    'Healthy Fats',
    'Fiber',
    'Vitamins & Minerals',
    'Hydration',
  ],
  'Muscle Gain': [
    'Protein',
    'Carbohydrates',
    'Post-workout Foods',
    'Pre-workout Foods',
    'Healthy Fats',
  ],
}

function getBmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

function getGenderOffset(gender) {
  if (gender === 'Male') return 5
  if (gender === 'Female') return -161
  return -78
}

function isAllowedForPreference(food, dietPreference) {
  if (dietPreference === 'Vegetarian') {
    return food.dietType === 'Vegetarian'
  }

  if (dietPreference === 'Eggitarian') {
    return food.dietType === 'Vegetarian' || food.dietType === 'Eggitarian'
  }

  return true
}

function sortByGoal(foodList, fitnessGoal) {
  const categoryPriority = goalCategoryPriority[fitnessGoal]
  const rankPriority = { S: 0, A: 1, B: 2 }

  return [...foodList].sort((first, second) => {
    const firstCategory = categoryPriority.indexOf(first.category)
    const secondCategory = categoryPriority.indexOf(second.category)
    const firstPriority =
      firstCategory === -1 ? categoryPriority.length : firstCategory
    const secondPriority =
      secondCategory === -1 ? categoryPriority.length : secondCategory

    if (firstPriority !== secondPriority) {
      return firstPriority - secondPriority
    }

    return rankPriority[first.rank] - rankPriority[second.rank]
  })
}

function firstFood(foodList, categories, fallbackIndex = 0) {
  return (
    foodList.find((food) => categories.includes(food.category)) ??
    foodList[fallbackIndex % foodList.length]
  )
}

function DietReport() {
  const [credentials, setCredentials] = useState(initialCredentials)

  const age = Number(credentials.age)
  const heightCm = Number(credentials.heightCm)
  const weightKg = Number(credentials.weightKg)
  const heightM = heightCm / 100

  const calculations = useMemo(() => {
    const hasValidInputs = age > 0 && heightCm > 0 && weightKg > 0

    if (!hasValidInputs) {
      return {
        bmi: 0,
        bmiCategory: '--',
        maintenanceCalories: 0,
        targetCalories: 0,
        proteinTarget: 0,
        hydrationLitres: 0,
      }
    }

    const bmi = weightKg / heightM ** 2
    const bmr =
      10 * weightKg +
      6.25 * heightCm -
      5 * age +
      getGenderOffset(credentials.gender)
    const maintenanceCalories =
      bmr * activityFactors[credentials.activityLevel]
    const targetCalories =
      maintenanceCalories + goalAdjustments[credentials.fitnessGoal]
    const proteinTarget = weightKg * proteinFactors[credentials.fitnessGoal]
    const hydrationLitres = (weightKg * 35) / 1000

    return {
      bmi,
      bmiCategory: getBmiCategory(bmi),
      maintenanceCalories,
      targetCalories,
      proteinTarget,
      hydrationLitres,
    }
  }, [
    age,
    credentials.activityLevel,
    credentials.fitnessGoal,
    credentials.gender,
    heightCm,
    heightM,
    weightKg,
  ])

  const recommendedFoods = useMemo(() => {
    const allowedFoods = foods.filter((food) =>
      isAllowedForPreference(food, credentials.dietPreference),
    )

    return sortByGoal(allowedFoods, credentials.fitnessGoal).slice(0, 9)
  }, [credentials.dietPreference, credentials.fitnessGoal])

  const mealPlan = useMemo(() => {
    const allowedFoods = sortByGoal(
      foods.filter((food) =>
        isAllowedForPreference(food, credentials.dietPreference),
      ),
      credentials.fitnessGoal,
    )

    return [
      {
        name: 'Breakfast',
        foods: [
          firstFood(allowedFoods, ['Protein'], 0),
          firstFood(allowedFoods, ['Carbohydrates'], 1),
        ].filter(Boolean),
      },
      {
        name: 'Lunch',
        foods: [
          firstFood(allowedFoods, ['Protein'], 2),
          firstFood(allowedFoods, ['Carbohydrates'], 3),
          firstFood(allowedFoods, ['Fiber', 'Vitamins & Minerals'], 4),
        ].filter(Boolean),
      },
      {
        name: 'Pre-workout',
        foods: [firstFood(allowedFoods, ['Pre-workout Foods'], 5)].filter(
          Boolean,
        ),
      },
      {
        name: 'Post-workout',
        foods: [firstFood(allowedFoods, ['Post-workout Foods'], 6)].filter(
          Boolean,
        ),
      },
      {
        name: 'Dinner',
        foods: [
          firstFood(allowedFoods, ['Protein'], 7),
          firstFood(allowedFoods, ['Fiber', 'Vitamins & Minerals'], 8),
        ].filter(Boolean),
      },
    ]
  }, [credentials.dietPreference, credentials.fitnessGoal])

  const reportStats = [
    { label: 'BMI', value: calculations.bmi ? calculations.bmi.toFixed(1) : '--' },
    { label: 'BMI Category', value: calculations.bmiCategory },
    {
      label: 'Maintenance Calories',
      value: `${Math.round(calculations.maintenanceCalories)} kcal`,
    },
    {
      label: 'Target Calories',
      value: `${Math.round(calculations.targetCalories)} kcal`,
    },
    {
      label: 'Daily Protein Target',
      value: `${Math.round(calculations.proteinTarget)} g`,
    },
    {
      label: 'Hydration',
      value: `${calculations.hydrationLitres.toFixed(1)} L/day`,
    },
  ]

  const updateCredential = (field, value) => {
    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [field]: value,
    }))
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Static Nutrition Recommendation
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Diet Suggestion Report
        </h1>
        <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-white/72">
          Enter your current details to estimate calories, protein, hydration,
          and simple food direction from the local Fit Minds food database.
        </p>
      </div>

      <form className="mt-6 rounded-3xl bg-white p-5 text-[#12351f] shadow-xl shadow-black/15 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
              Recommendation Inputs
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Your Training Credentials
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#ffdd33] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black">
            Local State Only
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Age
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-bold text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              min="1"
              onChange={(event) => updateCredential('age', event.target.value)}
              type="number"
              value={credentials.age}
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Gender
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) =>
                updateCredential('gender', event.target.value)
              }
              value={credentials.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Height (cm)
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-bold text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              min="1"
              onChange={(event) =>
                updateCredential('heightCm', event.target.value)
              }
              type="number"
              value={credentials.heightCm}
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Weight (kg)
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#f7fff2] px-4 py-3 text-sm font-bold text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              min="1"
              onChange={(event) =>
                updateCredential('weightKg', event.target.value)
              }
              type="number"
              value={credentials.weightKg}
            />
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Fitness Goal
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#fff9d8] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) =>
                updateCredential('fitnessGoal', event.target.value)
              }
              value={credentials.fitnessGoal}
            >
              <option value="Weight Loss">Weight Loss</option>
              <option value="Maintain Weight">Maintain Weight</option>
              <option value="Muscle Gain">Muscle Gain</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Activity Level
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#fff9d8] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) =>
                updateCredential('activityLevel', event.target.value)
              }
              value={credentials.activityLevel}
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
              <option value="Athlete">Athlete</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/55">
              Diet Preference
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-[#fff9d8] px-4 py-3 text-sm font-black text-[#12351f] outline-none transition focus:border-[#75ff38] focus:bg-white"
              onChange={(event) =>
                updateCredential('dietPreference', event.target.value)
              }
              value={credentials.dietPreference}
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Eggitarian">Eggitarian</option>
              <option value="Non Vegetarian">Non Vegetarian</option>
            </select>
          </label>
        </div>
      </form>

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
              Live Calculations
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Summary Direction
            </h2>
          </div>
          <span className="w-fit rounded-full bg-[#75ff38] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black">
            Updates Instantly
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          {recommendedFoods.map((food) => (
            <article
              className="overflow-hidden rounded-3xl bg-white text-black shadow-xl shadow-black/20"
              key={food.id}
            >
              <div className="bg-[#12351f] p-5 text-white">
                <div className="flex min-h-40 flex-col justify-between rounded-2xl border border-[#75ff38]/35 bg-black p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
                        Food Visual
                      </p>
                      <p className="mt-3 text-xl font-black">
                        {food.imagePlaceholderLabel}
                      </p>
                    </div>
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
                      {food.servingExample}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${rankStyles[food.rank]}`}
                  >
                    Rank {food.rank}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${dietTypeStyles[food.dietType]}`}
                  >
                    {food.dietType}
                  </span>
                  <span className="rounded-full bg-[#f7fff2] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#12351f]">
                    {food.caloriesPerServing}
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
          Meal Structure
        </p>
        <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
          Simple Day Layout
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {mealPlan.map((meal) => (
            <article
              className="rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20"
              key={meal.name}
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${mealAccents[meal.name]}`}
              >
                {meal.name}
              </span>
              <div className="mt-5 space-y-3">
                {meal.foods.map((food) => (
                  <div
                    className="rounded-2xl border border-[#12351f]/10 bg-[#f7fff2] p-3"
                    key={`${meal.name}-${food.id}`}
                  >
                    <p className="text-sm font-black leading-5 text-[#12351f]">
                      {food.name}
                    </p>
                    <p className="mt-1 text-xs font-bold leading-5 text-black/55">
                      {food.servingExample}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DietReport
