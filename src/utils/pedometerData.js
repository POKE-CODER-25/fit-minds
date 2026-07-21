export const DAILY_STEP_GOAL = 8000
export const STEP_STORAGE_KEY = 'fitMindsPedometer'

export function getIstDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getInitialStepData() {
  const todayDate = getIstDateKey()
  const fallback = {
    todayDate,
    todaySteps: 0,
    yesterdaySteps: 0,
    lastResetDate: todayDate,
  }

  try {
    const saved = window.localStorage.getItem(STEP_STORAGE_KEY)

    if (!saved) return fallback

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

export function saveStepData(stepData) {
  try {
    window.localStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(stepData))
  } catch (error) {
    console.error('Pedometer storage save failed:', error)
  }
}

export function getPedometerMetrics(todaySteps) {
  const safeSteps = Math.max(0, Number(todaySteps) || 0)

  return {
    steps: safeSteps,
    progress: Math.min(100, Math.round((safeSteps / DAILY_STEP_GOAL) * 100)),
    distanceKm: (safeSteps * 0.00075).toFixed(2),
    calories: Math.round(safeSteps * 0.04),
    activeMinutes: Math.round(safeSteps / 100),
  }
}
