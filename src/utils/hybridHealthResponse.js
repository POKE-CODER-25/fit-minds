import { generateHealthResponse, GeminiHealthAIError } from '../services/geminiHealthAI.js'
import {
  getHealthResponse,
  isClearlyUnrelated,
  isHealthFitnessRelated,
} from './healthResponseEngine.js'

export const CONFIDENCE = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
}

const unavailableResponse = {
  type: 'ai-unavailable',
  main: 'AI features are temporarily unavailable. Programmed Health AI is still active.\n\nYou can still ask about workouts, nutrition, hydration, BMI, recovery, walking, or beginner fitness.',
  steps: [],
  links: [],
}

const serviceErrorResponse = {
  type: 'ai-error',
  main: "I'm having trouble reaching the AI service right now.\n\nMeanwhile, you can ask about workouts, nutrition, hydration, BMI, recovery, walking, or beginner fitness.",
  steps: [],
  links: [],
}

const unsafeResponse = {
  type: 'unsafe-output',
  main: "I can't provide that kind of guidance. For safe help, please speak with a qualified healthcare professional.\n\nI can still help with general fitness, nutrition, walking, hydration, recovery, BMI, and beginner guidance.",
  steps: [],
  links: [],
}

export function routeHealthQuestion(question) {
  const programmedResponse = getHealthResponse(question)
  const confidence = programmedResponse.type === 'fallback'
    ? CONFIDENCE.LOW
    : programmedResponse.type === 'off-topic'
      ? CONFIDENCE.LOW
    : programmedResponse.type === 'medical'
      ? CONFIDENCE.MEDIUM
      : CONFIDENCE.HIGH

  const healthFitnessRelated = confidence === CONFIDENCE.LOW
    && isHealthFitnessRelated(question)
  const clearlyUnrelated = confidence === CONFIDENCE.LOW
    && isClearlyUnrelated(question)

  return {
    confidence,
    programmedResponse,
    healthFitnessRelated,
    useGemini: confidence === CONFIDENCE.LOW
      && healthFitnessRelated
      && !clearlyUnrelated,
  }
}

export async function getGeminiFallback(messages) {
  try {
    const text = await generateHealthResponse(messages)
    return { type: 'gemini', main: text, steps: [], links: [] }
  } catch (error) {
    if (error instanceof GeminiHealthAIError) {
      if (['API_KEY_UNAVAILABLE', 'API_KEY_REJECTED'].includes(error.code)) {
        return unavailableResponse
      }

      if (error.code === 'UNSAFE_OUTPUT') return unsafeResponse
    }

    return serviceErrorResponse
  }
}
