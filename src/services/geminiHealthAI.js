const MODEL = 'gemini-3.5-flash'
const MAX_CONTEXT_MESSAGES = 8
const AI_FOOTER = `━━━━━━━━━━━━━━━━━━

✨ AI Guidance

This response was generated using AI and should not replace professional medical advice.

━━━━━━━━━━━━━━━━━━`

const SYSTEM_INSTRUCTION = `You are Health AI inside the Fit Minds fitness application.

You help users with fitness, nutrition, exercise, walking, hydration, recovery, BMI, beginner fitness, and healthy habits.

You are not a doctor. Never diagnose diseases. Never prescribe medication. Never encourage unsafe exercise, extreme dieting, self-harm, illegal drug use, dangerous weight-loss methods, deliberate dehydration, or ignoring severe symptoms. Never replace qualified medical advice.

Keep answers practical, concise, supportive, and easy to understand. Use short paragraphs.

End with a clear section titled "Coach's Next Step" and give 2 to 4 actionable next steps.

Do not add an AI-generated disclaimer or an "AI Guidance" footer. The application adds that separately.`

const unsafeOutputPatterns = [
  /(?:use|take|try)\s+(?:cocaine|heroin|methamphetamine|steroids without|illegal drugs?)/i,
  /(?:starve|starvation|stop eating|eat nothing|extreme fast|fast for \d{2,}\s*(?:hours?|days?))/i,
  /(?:dehydrate yourself|avoid (?:all )?(?:water|fluids)|do not drink water)/i,
  /(?:ignore|push through)\s+(?:chest pain|severe pain|fainting|breathing difficulty)/i,
  /(?:you should|you need to|i recommend)\s+(?:take|start|stop)\s+(?:medication|medicine|pills?|insulin|antibiotics?)/i,
  /(?:you have|you definitely have|this is)\s+(?:a |an )?(?:disease|disorder|heart attack|diabetes|cancer|infection)/i,
  /(?:hurt|harm|kill)\s+(?:yourself|myself)/i,
  /(?:exercise|work out|train)\s+(?:until|despite)\s+(?:collapse|fainting|severe pain)/i,
]

export class GeminiHealthAIError extends Error {
  constructor(code) {
    super(code)
    this.name = 'GeminiHealthAIError'
    this.code = code
  }
}

export function isSafeHealthAIOutput(text) {
  return Boolean(text?.trim()) && !unsafeOutputPatterns.some((pattern) => pattern.test(text))
}

function toGeminiContents(messages) {
  return messages
    .filter((message) => message?.text && ['user', 'coach'].includes(message.role))
    .slice(-MAX_CONTEXT_MESSAGES)
    .map((message) => ({
      role: message.role === 'coach' ? 'model' : 'user',
      parts: [{ text: message.text }],
    }))
}

function addAIFooter(text) {
  const withoutExistingFooter = text.split(/━{5,}\s*\n?\s*✨?\s*AI Guidance/i)[0].trim()
  return `${withoutExistingFooter}\n\n${AI_FOOTER}`
}

function isCredentialError(error) {
  const status = Number(error?.status)
  return status === 400 || status === 401 || status === 403
}

export async function generateHealthResponse(messages) {
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY?.trim()

  if (!apiKey) {
    console.error('Gemini Health AI request skipped (API key unavailable).')
    throw new GeminiHealthAIError('API_KEY_UNAVAILABLE')
  }

  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { timeout: 15000 },
    })
    const contents = toGeminiContents(messages)

    if (contents.length === 0) {
      throw new GeminiHealthAIError('INVALID_REQUEST')
    }

    const result = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.35,
        maxOutputTokens: 900,
      },
    })
    const text = result.text?.trim()

    if (!text) {
      throw new GeminiHealthAIError('INVALID_RESPONSE')
    }

    if (!isSafeHealthAIOutput(text)) {
      throw new GeminiHealthAIError('UNSAFE_OUTPUT')
    }

    return addAIFooter(text)
  } catch (error) {
    if (error instanceof GeminiHealthAIError) throw error

    const code = isCredentialError(error) ? 'API_KEY_REJECTED' : 'SERVICE_UNAVAILABLE'
    console.error(`Gemini Health AI request failed (${code}).`)
    throw new GeminiHealthAIError(code)
  }
}
