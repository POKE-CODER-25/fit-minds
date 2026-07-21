import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { categorySuggestions } from '../../data/healthKnowledge.js'
import { getGeminiFallback, routeHealthQuestion } from '../../utils/hybridHealthResponse.js'

const coachCards = [
  {
    title: 'Training',
    description: 'Plan workouts that suit your pace.',
    icon: 'M13 5v14M6 8v8m14-8v8M3 10v4m18-4v4M6 12h14',
  },
  {
    title: 'Nutrition',
    description: 'Build balanced, practical food habits.',
    icon: 'M12 21v-9m0 0c0-4 2.5-7 7-8 0 4.5-2 8-7 8Zm0 0C12 8 9.5 5 5 4c0 4.5 2 8 7 8Z',
  },
  {
    title: 'Walking',
    description: 'Make every step count today.',
    icon: 'M13 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9.5 21l2-6 2 2v4m-6-9 3-4 3 2 3 1m-9 3 3 1',
  },
  {
    title: 'Hydration',
    description: 'Keep your daily water intake on track.',
    icon: 'M12 3s6 6.2 6 11a6 6 0 1 1-12 0c0-4.8 6-11 6-11Zm-3 12c.4 1.5 1.5 2.4 3 2.7',
  },
  {
    title: 'Recovery',
    description: 'Support rest, mobility, and recovery.',
    icon: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  },
  {
    title: 'Beginner Guide',
    description: 'Start strong with simple foundations.',
    icon: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z',
  },
  {
    title: 'Ask Coach',
    description: 'Bring your wellness questions here.',
    icon: 'M21 12a8 8 0 0 1-8 8H6l-3 2 1-5a8 8 0 1 1 17-5Zm-12-1h6m-6 4h4',
  },
]

const bmiCategories = [
  { max: 18.5, label: 'Underweight' },
  { max: 25, label: 'Normal' },
  { max: 30, label: 'Overweight' },
  { max: Infinity, label: 'Obese' },
]

function CoachIcon({ path }) {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d={path} />
    </svg>
  )
}

function HealthAI() {
  const [selectedCoach, setSelectedCoach] = useState('Training')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmiResult, setBmiResult] = useState(null)
  const [bmiError, setBmiError] = useState('')
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [isAIThinking, setIsAIThinking] = useState(false)
  const messageAreaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const shouldAutoScrollRef = useRef(true)
  const messageIdRef = useRef(0)
  const lastSentAtRef = useRef(0)

  const suggestedQuestions = categorySuggestions[selectedCoach]

  function nextMessageId(role) {
    messageIdRef.current += 1
    return `${role}-${messageIdRef.current}`
  }

  function calculateBmi(event) {
    event.preventDefault()
    const heightCm = Number(height)
    const weightKg = Number(weight)

    if (heightCm <= 0 || weightKg <= 0) {
      setBmiResult(null)
      setBmiError('Enter a valid height and weight to calculate your BMI.')
      return
    }

    const bmi = weightKg / (heightCm / 100) ** 2
    const category = bmiCategories.find((item) => bmi < item.max)?.label

    setBmiError('')
    setBmiResult({ value: bmi.toFixed(1), category })
  }

  async function askQuestion(question) {
    const trimmedMessage = question.trim()

    if (!trimmedMessage || isAIThinking) return

    const now = Date.now()

    if (now - lastSentAtRef.current < 900) {
      setChatMessages((current) => [
        ...current,
        {
          id: nextMessageId('coach'),
          role: 'coach',
          response: {
            type: 'cooldown',
            main: 'Please wait a moment before sending another message.',
            steps: [],
            links: [],
          },
        },
      ])
      return
    }

    lastSentAtRef.current = now
    const route = routeHealthQuestion(trimmedMessage)
    const userMessage = {
      id: nextMessageId('user'),
      role: 'user',
      text: trimmedMessage,
    }

    if (!route.useGemini) {
      setChatMessages((current) => [
        ...current,
        userMessage,
        {
          id: nextMessageId('coach'),
          role: 'coach',
          response: route.programmedResponse,
        },
      ])
      setMessage('')
      return
    }

    const context = [
      ...chatMessages.map((chatMessage) => ({
        role: chatMessage.role,
        text: chatMessage.text ?? chatMessage.response?.main,
      })),
      { role: 'user', text: trimmedMessage },
    ].slice(-8)

    setChatMessages((current) => [...current, userMessage])
    setMessage('')
    setIsAIThinking(true)

    const geminiResponse = await getGeminiFallback(context)

    setChatMessages((current) => [
      ...current,
      {
        id: nextMessageId('coach'),
        role: 'coach',
        response: geminiResponse,
      },
    ])
    setIsAIThinking(false)
  }

  function submitMessage(event) {
    event.preventDefault()
    askQuestion(message)
  }

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [chatMessages, isAIThinking])

  function trackMessageScroll(event) {
    const messageArea = event.currentTarget
    const distanceFromBottom = messageArea.scrollHeight
      - messageArea.scrollTop
      - messageArea.clientHeight

    shouldAutoScrollRef.current = distanceFromBottom < 96
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="overflow-hidden rounded-3xl bg-[#12351f] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ffdd33]">
              Fit Minds
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Health Coach AI
            </h1>
            <p className="mt-3 text-base font-semibold text-white/70 sm:text-lg">
              Your fitness and wellness companion.
            </p>
          </div>
          <div className="hidden rounded-2xl bg-[#75ff38] p-4 text-black sm:block">
            <CoachIcon path="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
          </div>
        </div>
      </header>

      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#75ff38]">
            Quick Coach
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">What can I help with?</h2>
        </div>
        <span className="hidden text-sm font-bold text-white/45 sm:block">
          Select a focus
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {coachCards.map((coach) => {
          const isSelected = selectedCoach === coach.title

          return (
            <button
              aria-pressed={isSelected}
              className={`group min-h-40 rounded-2xl border p-4 text-left shadow-lg transition duration-200 hover:-translate-y-1 hover:border-[#75ff38]/70 active:scale-[0.97] sm:p-5 ${
                isSelected
                  ? 'border-[#75ff38] bg-[#75ff38] text-black shadow-[#75ff38]/15'
                  : 'border-white/10 bg-white text-[#12351f] shadow-black/20'
              }`}
              key={coach.title}
              onClick={() => setSelectedCoach(coach.title)}
              type="button"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                  isSelected ? 'bg-black text-[#75ff38]' : 'bg-[#eefbe8] text-[#12351f] group-hover:bg-[#75ff38]'
                }`}
              >
                <CoachIcon path={coach.icon} />
              </span>
              <span className="mt-4 block text-base font-black">{coach.title}</span>
              <span className={`mt-1 block text-xs font-semibold leading-5 ${isSelected ? 'text-black/65' : 'text-black/55'}`}>
                {coach.description}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
          Try asking about {selectedCoach}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((question) => (
            <button
              className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-left text-xs font-bold text-white/80 transition hover:border-[#75ff38] hover:bg-[#75ff38] hover:text-black active:scale-95 disabled:cursor-wait disabled:opacity-50"
              disabled={isAIThinking}
              key={question}
              onClick={() => askQuestion(question)}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/50">
            Wellness Tool
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#12351f]">Body Check</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-black/55">
            Get a quick body mass index estimate.
          </p>

          <form className="mt-5" onSubmit={calculateBmi}>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-black text-[#12351f]">
                Height (cm)
                <input
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-[#f7fff2] px-3 font-bold outline-none transition focus:border-[#12351f] focus:ring-2 focus:ring-[#75ff38]"
                  inputMode="decimal"
                  min="1"
                  onChange={(event) => setHeight(event.target.value)}
                  placeholder="170"
                  step="0.1"
                  type="number"
                  value={height}
                />
              </label>
              <label className="text-sm font-black text-[#12351f]">
                Weight (kg)
                <input
                  className="mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-[#f7fff2] px-3 font-bold outline-none transition focus:border-[#12351f] focus:ring-2 focus:ring-[#75ff38]"
                  inputMode="decimal"
                  min="1"
                  onChange={(event) => setWeight(event.target.value)}
                  placeholder="65"
                  step="0.1"
                  type="number"
                  value={weight}
                />
              </label>
            </div>
            <button
              className="mt-4 min-h-12 w-full rounded-xl bg-[#12351f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#194a2c] active:scale-[0.98]"
              type="submit"
            >
              Calculate BMI
            </button>
          </form>

          {bmiError && <p className="mt-3 text-sm font-bold text-red-700">{bmiError}</p>}

          <div aria-live="polite" className="mt-5 rounded-2xl bg-[#f7fff2] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/50">BMI value</p>
                <p className="mt-1 text-4xl font-black text-[#12351f]">{bmiResult?.value ?? '—'}</p>
              </div>
              <span className="rounded-full bg-[#ffdd33] px-3 py-2 text-xs font-black text-black">
                {bmiResult?.category ?? 'Not calculated'}
              </span>
            </div>
            <div className="mt-4 border-t border-[#12351f]/10 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#12351f]/50">Coach&apos;s Note</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#12351f]/70">
                {bmiResult
                  ? 'BMI is a general screening measure. Consider your overall health and speak with a professional for personal guidance.'
                  : 'Enter your measurements to see your BMI category.'}
              </p>
            </div>
          </div>
        </article>

        <article className="flex min-h-[31rem] flex-col rounded-3xl bg-[#12351f] p-5 shadow-xl shadow-black/25 sm:p-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#75ff38] text-black">
              <CoachIcon path="M21 12a8 8 0 0 1-8 8H6l-3 2 1-5a8 8 0 1 1 17-5Zm-12-1h6m-6 4h4" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Ask Coach</h2>
              <p className="text-xs font-bold text-[#75ff38]">Programmed first · AI fallback</p>
            </div>
          </div>

          <div
            aria-live="polite"
            className="flex max-h-[34rem] flex-1 flex-col gap-3 overflow-y-auto pb-10 pt-5 pr-1"
            onScroll={trackMessageScroll}
            ref={messageAreaRef}
          >
            {chatMessages.length === 0 ? (
              <div className="m-auto max-w-sm text-center">
                <p className="text-base font-black text-white">Your conversation starts here.</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
                  Ask a fitness or wellness question to preview the coach experience.
                </p>
              </div>
            ) : (
              chatMessages.map((chatMessage) => {
                const response = chatMessage.response

                return (
                  <div
                    className={`h-auto max-w-[90%] overflow-visible rounded-2xl px-4 py-3 text-sm font-semibold leading-6 [overflow-wrap:anywhere] ${
                      chatMessage.role === 'user'
                        ? 'ml-auto rounded-br-md bg-[#75ff38] text-black'
                        : response?.type === 'urgent'
                          ? 'rounded-bl-md border border-red-300 bg-red-50 text-red-950'
                          : 'rounded-bl-md bg-white text-[#12351f]'
                    }`}
                    key={chatMessage.id}
                  >
                    {chatMessage.role === 'user' ? (
                      chatMessage.text
                    ) : (
                      <div className="h-auto overflow-visible">
                        <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{response.main}</p>
                        {response.steps.length > 0 && (
                          <div className="mt-3 border-t border-black/10 pt-3">
                            <p className="font-black">Coach&apos;s Next Step</p>
                            <ul className="mt-1 space-y-1">
                              {response.steps.map((step) => <li key={step}>✓ {step}</li>)}
                            </ul>
                          </div>
                        )}
                        {response.examples?.length > 0 && (
                          <div className="mt-3 border-t border-black/10 pt-3">
                            <p className="font-black">Try asking:</p>
                            <ul className="mt-1 space-y-1 text-[#12351f]/75">
                              {response.examples.map((example) => <li key={example}>• {example}</li>)}
                            </ul>
                          </div>
                        )}
                        {response.links.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {response.links.map((link) => (
                              <Link
                                className="rounded-full bg-[#12351f] px-3 py-1.5 text-xs font-black text-white transition hover:bg-[#194a2c]"
                                key={link}
                                to={link}
                              >
                                Open {link === '/workout/exercises' ? 'Exercise Rankings' : link.slice(1).replace('-', ' ')}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
            {isAIThinking && (
              <div className="h-auto w-fit overflow-visible rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm font-bold text-[#12351f]">
                <span className="inline-flex items-center gap-2" aria-label="Health AI is thinking">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((dot) => (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#12351f]/55" key={dot} />
                    ))}
                  </span>
                  Health AI is thinking...
                </span>
              </div>
            )}
            <div aria-hidden="true" className="h-px shrink-0" ref={messagesEndRef} />
          </div>

          <form className="flex gap-2 border-t border-white/10 pt-4" onSubmit={submitMessage}>
            <label className="sr-only" htmlFor="coach-message">Ask Health Coach AI</label>
            <input
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-black/35 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/40 focus:border-[#75ff38] focus:ring-2 focus:ring-[#75ff38]/30"
              id="coach-message"
              disabled={isAIThinking}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask your coach..."
              type="text"
              value={message}
            />
            <button
              className="min-h-12 rounded-xl bg-[#ffdd33] px-5 text-sm font-black text-black transition hover:bg-[#ffe866] active:scale-95 disabled:cursor-wait disabled:opacity-60"
              disabled={isAIThinking || !message.trim()}
              type="submit"
            >
              Send
            </button>
          </form>
        </article>
      </div>

      <article className="mt-5 rounded-3xl bg-[#fff9d8] p-5 text-black shadow-xl shadow-black/20 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#12351f]/50">Daily Momentum</p>
            <h2 className="mt-2 text-2xl font-black text-[#12351f]">Coach&apos;s Next Step</h2>
          </div>
          <div className="grid gap-2 text-sm font-black text-[#12351f] sm:grid-cols-3 sm:gap-3">
            {['Stay hydrated', 'Walk today', 'Stretch after workouts'].map((tip) => (
              <span className="rounded-xl bg-white px-4 py-3 shadow-sm" key={tip}>
                <span className="mr-2 text-green-700">✓</span>{tip}
              </span>
            ))}
          </div>
        </div>
      </article>

      <aside className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">Medical Disclaimer</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
          Health Coach AI provides educational guidance only. It does not replace professional medical advice. Consult a qualified healthcare professional for diagnosis or treatment.
        </p>
      </aside>
    </section>
  )
}

export default HealthAI
