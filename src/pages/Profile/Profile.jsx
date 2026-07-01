import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CheckboxGroup from '../../components/CheckboxGroup.jsx'
import FormField from '../../components/FormField.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import SelectField from '../../components/SelectField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import {
  createFitnessProfile,
  updateFitnessProfile,
} from '../../services/firestoreService.js'

const emptyProfile = {
  fullName: '',
  age: '',
  gender: '',
  heightCm: '',
  weightKg: '',
  fitnessGoal: '',
  activityLevel: '',
  dietPreference: '',
  workoutExperience: '',
  healthConditions: ['None'],
}

const fieldLabels = {
  fullName: 'Full Name',
  age: 'Age',
  gender: 'Gender',
  heightCm: 'Height (cm)',
  weightKg: 'Weight (kg)',
  fitnessGoal: 'Fitness Goal',
  activityLevel: 'Activity Level',
  dietPreference: 'Diet Preference',
  workoutExperience: 'Workout Experience',
  healthConditions: 'Health Conditions',
}

const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say']
const fitnessGoalOptions = [
  'Lose Fat',
  'Build Muscle',
  'Maintain Weight',
  'General Fitness',
]
const activityLevelOptions = [
  'Sedentary',
  'Light',
  'Moderate',
  'Active',
  'Very Active',
]
const dietPreferenceOptions = [
  'Vegetarian',
  'Eggitarian',
  'Non Vegetarian',
  'Vegan',
]
const workoutExperienceOptions = ['Beginner', 'Intermediate', 'Advanced']
const healthConditionOptions = [
  'None',
  'Diabetes',
  'High Blood Pressure',
  'Heart Condition',
  'Asthma',
  'Joint Problems',
  'Other',
]

function toFormProfile(profile) {
  if (!profile) {
    return emptyProfile
  }

  return {
    fullName: profile.fullName || '',
    age: profile.age ? String(profile.age) : '',
    gender: profile.gender || '',
    heightCm: profile.heightCm ? String(profile.heightCm) : '',
    weightKg: profile.weightKg ? String(profile.weightKg) : '',
    fitnessGoal: profile.fitnessGoal || '',
    activityLevel: profile.activityLevel || '',
    dietPreference: profile.dietPreference || '',
    workoutExperience: profile.workoutExperience || '',
    healthConditions: profile.healthConditions?.length
      ? profile.healthConditions
      : ['None'],
  }
}

function toFirestoreProfile(form) {
  return {
    fullName: form.fullName.trim(),
    age: Number(form.age),
    gender: form.gender,
    heightCm: Number(form.heightCm),
    weightKg: Number(form.weightKg),
    fitnessGoal: form.fitnessGoal,
    activityLevel: form.activityLevel,
    dietPreference: form.dietPreference,
    workoutExperience: form.workoutExperience,
    healthConditions: form.healthConditions,
  }
}

function Profile() {
  const { currentUser, profile, refreshProfile, profileLoading } = useAuth()
  const [form, setForm] = useState(() => toFormProfile(profile))
  const [editing, setEditing] = useState(!profile)
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const isFirstProfile = !profile
  const showAgeWarning = Number(form.age) > 50

  const profileRows = useMemo(
    () => [
      ['fullName', form.fullName],
      ['age', form.age],
      ['gender', form.gender],
      ['heightCm', form.heightCm],
      ['weightKg', form.weightKg],
      ['fitnessGoal', form.fitnessGoal],
      ['activityLevel', form.activityLevel],
      ['dietPreference', form.dietPreference],
      ['workoutExperience', form.workoutExperience],
      ['healthConditions', form.healthConditions.join(', ')],
    ],
    [form],
  )

  useEffect(() => {
    setForm(toFormProfile(profile))
    setEditing(!profile)
    setAcceptedDisclaimer(false)
  }, [profile])

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  function handleHealthConditionChange(option) {
    setForm((current) => {
      if (option === 'None') {
        return { ...current, healthConditions: ['None'] }
      }

      const withoutNone = current.healthConditions.filter(
        (condition) => condition !== 'None',
      )
      const nextConditions = withoutNone.includes(option)
        ? withoutNone.filter((condition) => condition !== option)
        : [...withoutNone, option]

      return {
        ...current,
        healthConditions: nextConditions.length ? nextConditions : ['None'],
      }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!acceptedDisclaimer) {
      setError('You must accept the disclaimer before continuing.')
      return
    }

    setSaving(true)
    try {
      const firestoreProfile = toFirestoreProfile(form)

      if (isFirstProfile) {
        await createFitnessProfile(
          currentUser.uid,
          currentUser.email,
          firestoreProfile,
        )
      } else {
        await updateFitnessProfile(currentUser.uid, firestoreProfile)
      }

      await refreshProfile(currentUser.uid)
      setAcceptedDisclaimer(false)

      if (isFirstProfile) {
        navigate('/home', { replace: true })
        return
      }

      setEditing(false)
    } catch {
      setError('Profile could not be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (profileLoading) {
    return <LoadingSpinner label="Loading profile..." />
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 text-black shadow-xl shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#75ff38]">
              Prototype Version
            </p>
            <h1 className="mt-3 text-3xl font-black text-[#12351f]">
              Profile
            </h1>
          </div>

          {profile && !editing && (
            <button
              className="rounded-2xl bg-[#75ff38] px-5 py-3 font-black text-black shadow-lg shadow-[#75ff38]/20"
              onClick={() => setEditing(true)}
              type="button"
            >
              Edit Profile
            </button>
          )}
        </div>

        {!editing ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {profileRows.map(([key, value]) => (
              <div
                className="rounded-2xl border border-[#12351f]/10 bg-[#f7fff2] p-4 shadow-sm"
                key={key}
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/60">
                  {fieldLabels[key]}
                </p>
                <p className="mt-2 text-base font-black text-[#12351f]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                placeholder="Enter full name"
                value={form.fullName}
              />
              <FormField
                label="Age"
                min="1"
                name="age"
                onChange={handleChange}
                placeholder="Enter age"
                type="number"
                value={form.age}
              />
              <SelectField
                label="Gender"
                name="gender"
                onChange={handleChange}
                options={genderOptions}
                value={form.gender}
              />
              <FormField
                label="Height (cm)"
                min="1"
                name="heightCm"
                onChange={handleChange}
                placeholder="Enter height"
                type="number"
                value={form.heightCm}
              />
              <FormField
                label="Weight (kg)"
                min="1"
                name="weightKg"
                onChange={handleChange}
                placeholder="Enter weight"
                type="number"
                value={form.weightKg}
              />
              <SelectField
                label="Fitness Goal"
                name="fitnessGoal"
                onChange={handleChange}
                options={fitnessGoalOptions}
                value={form.fitnessGoal}
              />
              <SelectField
                label="Activity Level"
                name="activityLevel"
                onChange={handleChange}
                options={activityLevelOptions}
                value={form.activityLevel}
              />
              <SelectField
                label="Diet Preference"
                name="dietPreference"
                onChange={handleChange}
                options={dietPreferenceOptions}
                value={form.dietPreference}
              />
              <SelectField
                label="Workout Experience"
                name="workoutExperience"
                onChange={handleChange}
                options={workoutExperienceOptions}
                value={form.workoutExperience}
              />
            </div>

            <CheckboxGroup
              label="Health Conditions"
              name="healthConditions"
              onChange={handleHealthConditionChange}
              options={healthConditionOptions}
              values={form.healthConditions}
            />

            <div className="rounded-3xl border border-[#ffdd33]/50 bg-[#fff9d8] p-5 text-[#12351f]">
              <h2 className="text-lg font-black">Disclaimer</h2>
              <p className="mt-2 text-sm font-semibold leading-6">
                Fit Minds is a prototype and does not provide medical advice.
                Any workout or diet recommendations should be followed at your
                own discretion.
              </p>
              {showAgeWarning && (
                <p className="mt-3 text-sm font-black leading-6">
                  If you are above 50 years of age, please consult your doctor
                  before following any workout or diet recommendations.
                </p>
              )}
              <label className="mt-4 flex items-start gap-3 text-sm font-black">
                <input
                  checked={acceptedDisclaimer}
                  className="mt-1 h-4 w-4 accent-[#75ff38]"
                  onChange={(event) =>
                    setAcceptedDisclaimer(event.target.checked)
                  }
                  type="checkbox"
                />
                I have read and accept the disclaimer.
              </label>
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-2xl bg-[#75ff38] px-6 py-3 font-black text-black shadow-lg shadow-[#75ff38]/20 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {profile && (
                <button
                  className="rounded-2xl border border-[#12351f]/15 bg-white px-6 py-3 font-black text-[#12351f]"
                  disabled={saving}
                  onClick={() => {
                    setForm(toFormProfile(profile))
                    setEditing(false)
                    setAcceptedDisclaimer(false)
                    setError('')
                  }}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

export default Profile
