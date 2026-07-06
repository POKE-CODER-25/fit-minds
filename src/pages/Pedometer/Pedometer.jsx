import { useEffect, useMemo, useRef, useState } from 'react'

const DAILY_GOAL = 8000
const STEP_STORAGE_KEY = 'fitMindsPedometer'
const STEP_THRESHOLD = 2.6
const STEP_COOLDOWN_MS = 360
const STOPPED_AFTER_MS = 1800

const supportLabels = [
  'Mobile supported',
  'Desktop fallback',
  'Permission required',
]

function getIstDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getInitialStepData() {
  const todayDate = getIstDateKey()
  const fallback = {
    todayDate,
    todaySteps: 0,
    yesterdaySteps: 0,
    lastResetDate: todayDate,
  }

  try {
    const saved = window.localStorage.getItem(STEP_STORAGE_KEY)

    if (!saved) {
      return fallback
    }

    const parsed = JSON.parse(saved)
    const savedTodayDate = parsed.todayDate || todayDate
    const savedTodaySteps = Number(parsed.todaySteps) || 0

    if (savedTodayDate !== todayDate) {
      return {
        todayDate,
        todaySteps: 0,
        yesterdaySteps: savedTodaySteps,
        lastResetDate: todayDate,
      }
    }

    return {
      todayDate,
      todaySteps: savedTodaySteps,
      yesterdaySteps: Number(parsed.yesterdaySteps) || 0,
      lastResetDate: parsed.lastResetDate || todayDate,
    }
  } catch (error) {
    console.error('Pedometer storage load failed:', error)
    return fallback
  }
}

function saveStepData(stepData) {
  try {
    window.localStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(stepData))
  } catch (error) {
    console.error('Pedometer storage save failed:', error)
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

function formatStopwatch(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, '0'))
    .join(':')
}

function getMotionSupport() {
  if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
    return 'unsupported'
  }

  if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
    return 'permission-required'
  }

  return 'supported'
}

function PedometerCard({ children, className = '' }) {
  return (
    <article
      className={`rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6 ${className}`}
    >
      {children}
    </article>
  )
}

function Pedometer() {
  const [stepData, setStepData] = useState(getInitialStepData)
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [motionStatus, setMotionStatus] = useState(() => getMotionSupport())
  const [isWalking, setIsWalking] = useState(false)
  const [motionError, setMotionError] = useState('')
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)

  const stepDataRef = useRef(stepData)
  const lastMagnitudeRef = useRef(0)
  const lastStepAtRef = useRef(0)
  const lastMovementAtRef = useRef(0)

  const todaySteps = stepData.todaySteps
  const progress = Math.min(100, Math.round((todaySteps / DAILY_GOAL) * 100))
  const distanceKm = (todaySteps * 0.00075).toFixed(2)
  const calories = Math.round(todaySteps * 0.04)
  const activeMinutes = Math.round(todaySteps / 100)

  const trackingLabel = useMemo(() => {
    if (motionStatus === 'unsupported') {
      return 'Unsupported'
    }

    if (motionStatus === 'denied') {
      return 'Permission Denied'
    }

    if (motionStatus === 'error') {
      return 'Sensor Error'
    }

    if (!trackingEnabled) {
      return 'Ready'
    }

    return isWalking ? 'Walking Detected' : 'Paused'
  }, [isWalking, motionStatus, trackingEnabled])

  const todayStats = [
    ['Distance', `${distanceKm} km`],
    ['Calories Burned', `${formatNumber(calories)} kcal`],
    ['Active Time', `${formatNumber(activeMinutes)} min`],
  ]

  function updateStepData(updater) {
    setStepData((current) => {
      const next = updater(current)
      stepDataRef.current = next
      saveStepData(next)
      return next
    })
  }

  function resetIfNewIstDay() {
    const todayDate = getIstDateKey()
    const current = stepDataRef.current

    if (current.todayDate === todayDate) {
      return
    }

    updateStepData(() => ({
      todayDate,
      todaySteps: 0,
      yesterdaySteps: current.todaySteps,
      lastResetDate: todayDate,
    }))
  }

  async function handleEnableTracking() {
    setMotionError('')

    if (getMotionSupport() === 'unsupported') {
      setMotionStatus('unsupported')
      setTrackingEnabled(false)
      return
    }

    try {
      if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const permission = await window.DeviceMotionEvent.requestPermission()

        if (permission !== 'granted') {
          setMotionStatus('denied')
          setTrackingEnabled(false)
          return
        }
      }

      lastMovementAtRef.current = Date.now()
      setMotionStatus('supported')
      setTrackingEnabled(true)
    } catch (error) {
      console.error('Motion permission failed:', error)
      setMotionError('Motion permission failed. Try again from a mobile browser.')
      setMotionStatus('error')
      setTrackingEnabled(false)
    }
  }

  function handleStopTracking() {
    setTrackingEnabled(false)
    setIsWalking(false)
  }

  useEffect(() => {
    stepDataRef.current = stepData
  }, [stepData])

  useEffect(() => {
    const timerId = window.setInterval(resetIfNewIstDay, 60 * 1000)

    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    if (!trackingEnabled || motionStatus !== 'supported') {
      return undefined
    }

    function handleMotion(event) {
      resetIfNewIstDay()

      const acceleration =
        event.accelerationIncludingGravity || event.acceleration

      if (!acceleration) {
        return
      }

      const x = acceleration.x || 0
      const y = acceleration.y || 0
      const z = acceleration.z || 0
      const magnitude = Math.sqrt(x * x + y * y + z * z)
      const change = Math.abs(magnitude - lastMagnitudeRef.current)
      const now = Date.now()

      lastMagnitudeRef.current = magnitude

      if (change > 0.8) {
        lastMovementAtRef.current = now
        setIsWalking(true)
      }

      if (change > STEP_THRESHOLD && now - lastStepAtRef.current > STEP_COOLDOWN_MS) {
        lastStepAtRef.current = now
        updateStepData((current) => ({
          ...current,
          todaySteps: current.todaySteps + 1,
        }))
      }
    }

    window.addEventListener('devicemotion', handleMotion)

    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [motionStatus, trackingEnabled])

  useEffect(() => {
    if (!trackingEnabled) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      if (Date.now() - lastMovementAtRef.current > STOPPED_AFTER_MS) {
        setIsWalking(false)
      }
    }, 500)

    return () => window.clearInterval(timerId)
  }, [trackingEnabled])

  useEffect(() => {
    if (!stopwatchRunning) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setStopwatchSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [stopwatchRunning])

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffdd33]">
          Functional Pedometer
        </p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Smart Step Tracker
        </h1>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-white/72">
          Tracks walking motion on supported mobile browsers and stores today
          step data locally on this device.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <PedometerCard>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
                Steps Today
              </p>
              <p className="mt-3 text-6xl font-black leading-none text-[#12351f] sm:text-7xl">
                {formatNumber(todaySteps)}
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#75ff38] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-black shadow-md shadow-[#75ff38]/20">
              {trackingLabel}
            </span>
          </div>

          <div className="mt-8 rounded-2xl bg-[#f7fff2] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
                  Daily Goal
                </p>
                <p className="mt-1 text-xl font-black text-[#12351f]">
                  {formatNumber(DAILY_GOAL)} steps
                </p>
              </div>
              <p className="text-xl font-black text-[#12351f]">{progress}%</p>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-[#12351f]/12">
              <div
                className="h-full rounded-full bg-[#75ff38] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </PedometerCard>

        <PedometerCard className="bg-[#fff9d8]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
            Yesterday
          </p>
          <p className="mt-3 text-4xl font-black text-[#12351f]">
            {formatNumber(stepData.yesterdaySteps)} steps
          </p>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#12351f]/70">
            Saved locally after the 12:00 AM IST daily reset.
          </p>
        </PedometerCard>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {todayStats.map(([label, value]) => (
          <PedometerCard className="p-5 sm:p-5" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
              {label}
            </p>
            <p className="mt-3 text-2xl font-black text-[#12351f]">{value}</p>
          </PedometerCard>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PedometerCard className="bg-[#12351f] text-white">
          <h2 className="text-2xl font-black">Walking Detection</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/72">
            Counting starts after motion permission is enabled. Step detection
            pauses automatically when movement stops.
          </p>

          {motionStatus === 'unsupported' && (
            <p className="mt-5 rounded-2xl bg-black p-4 text-sm font-bold leading-6 text-[#ffdd33]">
              Automatic tracking not supported on this device/browser.
            </p>
          )}

          {motionStatus === 'denied' && (
            <p className="mt-5 rounded-2xl bg-black p-4 text-sm font-bold leading-6 text-[#ffdd33]">
              Motion permission was denied. Enable motion access in your browser
              settings to use automatic step tracking.
            </p>
          )}

          {motionError && (
            <p className="mt-5 rounded-2xl bg-black p-4 text-sm font-bold leading-6 text-[#ffdd33]">
              {motionError}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {trackingEnabled ? (
              <button
                className="rounded-full bg-[#ffdd33] px-4 py-3 text-sm font-black text-black transition hover:bg-[#ffe866]"
                onClick={handleStopTracking}
                type="button"
              >
                Stop Tracking
              </button>
            ) : (
              <button
                className="rounded-full bg-[#75ff38] px-4 py-3 text-sm font-black text-black transition hover:bg-[#8dff5f] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={motionStatus === 'unsupported'}
                onClick={handleEnableTracking}
                type="button"
              >
                Enable Tracking
              </button>
            )}
            <span className="rounded-full border border-[#75ff38]/35 bg-black px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#75ff38]">
              {isWalking ? 'Moving' : 'No Walking Motion'}
            </span>
          </div>
        </PedometerCard>

        <PedometerCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/55">
            Stopwatch
          </p>
          <p className="mt-3 text-4xl font-black text-[#12351f]">
            {formatStopwatch(stopwatchSeconds)}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              className="min-h-12 rounded-2xl bg-[#75ff38] px-4 py-3 text-sm font-black text-black shadow-lg shadow-[#75ff38]/20 transition hover:bg-[#8dff5f]"
              onClick={() => setStopwatchRunning(true)}
              type="button"
            >
              Start
            </button>
            <button
              className="min-h-12 rounded-2xl bg-[#ffdd33] px-4 py-3 text-sm font-black text-black shadow-lg shadow-[#ffdd33]/20 transition hover:bg-[#ffe866]"
              onClick={() => setStopwatchRunning(false)}
              type="button"
            >
              Pause
            </button>
            <button
              className="min-h-12 rounded-2xl border border-[#12351f]/15 bg-white px-4 py-3 text-sm font-black text-[#12351f] transition hover:bg-[#f7fff2]"
              onClick={() => {
                setStopwatchRunning(false)
                setStopwatchSeconds(0)
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </PedometerCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PedometerCard>
          <h2 className="text-2xl font-black text-[#12351f]">
            Permission / Device Support
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-black/65">
            Step tracking works best on supported mobile browsers with motion
            permissions. Desktop browsers usually show the safe fallback.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {supportLabels.map((label) => (
              <span
                className="rounded-full bg-[#f7fff2] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#12351f]"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </PedometerCard>

        <PedometerCard className="border border-[#ffdd33]/50 bg-[#fff9d8]">
          <h2 className="text-2xl font-black text-[#12351f]">Safety Note</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#12351f]/75">
            Walk at your own pace. If you feel dizziness, chest pain, joint
            pain, or breathing difficulty, stop and consult a healthcare
            professional.
          </p>
        </PedometerCard>
      </div>
    </section>
  )
}

export default Pedometer
