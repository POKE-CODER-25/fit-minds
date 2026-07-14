import { categorySuggestions, healthIntents } from '../data/healthKnowledge.js'

const urgentPhrases = [
  'chest pain', 'cannot breathe', "can't breathe", 'severe breathing difficulty',
  'fainting', 'fainted', 'unconscious', 'severe injury', 'heavy bleeding',
  'sudden weakness', 'possible heart attack', 'heart attack',
]

const offTopicWords = [
  'coding', 'programming', 'javascript', 'python', 'politics', 'election',
  'movie', 'movies', 'celebrity', 'entertainment', 'essay', 'history',
  'geography', 'computer', 'software', 'stock market', 'cryptocurrency',
]

const healthWords = [
  'fitness', 'health', 'exercise', 'workout', 'gym', 'train', 'training', 'muscle',
  'weight', 'food', 'diet', 'protein', 'meal', 'walking', 'walk', 'steps',
  'water', 'hydration', 'recovery', 'sore', 'pain', 'sleep', 'stretch', 'bmi',
  'cardio', 'strength', 'fat', 'calorie', 'body', 'beginner', 'lift',
]

const conditionWords = [
  'diabetes', 'thyroid', 'hypertension', 'blood pressure', 'asthma', 'disease',
  'condition', 'medication', 'pregnant', 'pregnancy', 'allergy', 'diagnose',
]

export function normalizeQuestion(question) {
  return question
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9',\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function containsAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase))
}

function scoreIntent(text, intent) {
  return intent.phrases.reduce((best, phrase) => {
    if (!text.includes(phrase)) return best
    return Math.max(best, phrase.split(' ').length * 2 + phrase.length / 20)
  }, 0)
}

function examplesForText(text) {
  const category = healthIntents.find((intent) =>
    intent.category.toLowerCase().split(' ').some((word) => text.includes(word)),
  )?.category
  const cardCategory = category === 'Beginner Guidance' ? 'Beginner Guide' : category
  return (categorySuggestions[cardCategory] ?? categorySuggestions['Ask Coach']).slice(0, 3)
}

export function getHealthResponse(question) {
  const normalized = normalizeQuestion(question)

  if (containsAny(normalized, urgentPhrases)) {
    return {
      type: 'urgent',
      main: 'This may require immediate medical attention. Stop exercising and contact local emergency services or a qualified healthcare professional now.',
      steps: [],
      links: [],
    }
  }

  if (containsAny(normalized, conditionWords)) {
    return {
      type: 'medical',
      main: 'I can provide general education, but I cannot diagnose a condition or create a medical exercise or diet prescription. A qualified doctor or registered dietitian can review your symptoms, history, and medications safely.',
      steps: ['Pause any activity that worsens symptoms', 'Write down your question and relevant symptoms', 'Consult an appropriate healthcare professional'],
      links: [],
    }
  }

  if (containsAny(normalized, offTopicWords) && !containsAny(normalized, healthWords)) {
    return {
      type: 'off-topic',
      main: "I'm designed to help with fitness, nutrition, exercise, walking, hydration, recovery, BMI, and healthy lifestyle guidance.",
      steps: [],
      links: [],
    }
  }

  const match = healthIntents
    .map((intent) => ({ intent, score: scoreIntent(normalized, intent) }))
    .sort((a, b) => b.score - a.score)[0]

  if (match?.score > 0) {
    return { type: 'supported', category: match.intent.category, ...match.intent }
  }

  if (containsAny(normalized, healthWords)) {
    return {
      type: 'fallback',
      main: 'I understand this is related to your health or fitness journey, but I need a little more detail. Try mentioning your goal, experience level, exercise, food, walking, hydration, or recovery concern.',
      steps: [],
      links: [],
      examples: examplesForText(normalized),
    }
  }

  return {
    type: 'off-topic',
    main: "I'm designed to help with fitness, nutrition, exercise, walking, hydration, recovery, BMI, and healthy lifestyle guidance.",
    steps: [],
    links: [],
  }
}
