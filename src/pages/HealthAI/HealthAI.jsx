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

const welcomePrompts = [
  'How much water should I drink?',
  'Help me plan a beginner workout',
  'What should I eat before training?',
  'How can I improve my recovery?',
]

const featureLinkDetails = {
  '/workout': { label: 'Open Workout Planner', icon: 'M5 12h14M12 5l7 7-7 7' },
  '/workout/exercises': { label: 'View Exercise Rankings', icon: 'M4 19V9m6 10V5m6 14v-7m4 7H2' },
  '/pedometer': { label: 'Open Pedometer', icon: 'M13 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9.5 21l2-6 2 2v4m-6-9 3-4 3 2 3 1' },
  '/diet': { label: 'View Diet Suggestions', icon: 'M12 21v-9m0 0c0-4 2.5-7 7-8 0 4.5-2 8-7 8Zm0 0C12 8 9.5 5 5 4c0 4.5 2 8 7 8Z' },
  '/diet-report': { label: 'Open Diet Report', icon: 'M7 3h10v4H7zM5 7h14v14H5zM8 12h8m-8 4h5' },
}

function localTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function InlineText({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => (
    part.startsWith('**') && part.endsWith('**')
      ? <strong className="font-black" key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
      : <span key={`${part}-${index}`}>{part}</span>
  ))
}

function FormattedResponse({ text }) {
  return (
    <div className="space-y-2.5 whitespace-pre-wrap [overflow-wrap:anywhere]">
      {text.split('\n').map((rawLine, index) => {
        const line = rawLine.trim()
        if (!line) return <div aria-hidden="true" className="h-1" key={`space-${index}`} />

        const bullet = line.match(/^[-•*]\s+(.+)/)
        const numbered = line.match(/^(\d+)[.)]\s+(.+)/)
        const heading = line.match(/^#{1,4}\s+(.+)/)
        const isGuidance = /AI Guidance/i.test(line)
        const isSeparator = /^━{5,}$/.test(line)

        if (bullet) {
          return <div className="flex gap-2" key={`bullet-${index}`}><span aria-hidden="true" className="font-black text-green-700">•</span><p><InlineText text={bullet[1]} /></p></div>
        }
        if (numbered) {
          return <div className="flex gap-2" key={`number-${index}`}><span className="font-black text-green-800">{numbered[1]}.</span><p><InlineText text={numbered[2]} /></p></div>
        }
        if (heading) return <p className="pt-1 font-black text-[#12351f]" key={`heading-${index}`}><InlineText text={heading[1]} /></p>
        if (isSeparator) return <div aria-hidden="true" className="my-3 border-t border-[#12351f]/15" key={`rule-${index}`} />
        if (isGuidance) return <p className="pt-1 text-xs font-black uppercase tracking-[0.12em] text-[#12351f]/65" key={`guidance-${index}`}><InlineText text={line} /></p>

        return <p key={`paragraph-${index}`}><InlineText text={line} /></p>
      })}
    </div>
  )
}

function AssistantAvatar({ urgent = false }) {
  return (
    <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${urgent ? 'bg-red-100 text-red-700' : 'bg-[#75ff38] text-[#12351f]'}`}>
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d={urgent ? 'M12 9v4m0 4h.01M10.3 3.7 2.5 18a2 2 0 0 0 1.8 3h15.4a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z' : 'M12 3v3m0 12v3M3 12h3m12 0h3M7.8 7.8l-2-2m10.4 2 2-2m-2 10.4 2 2m-10.4-2-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'} />
      </svg>
    </span>
  )
}

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
  const [copiedMessageId, setCopiedMessageId] = useState(null)
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
          timestamp: localTime(),
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
      timestamp: localTime(),
    }

    if (!route.useGemini) {
      setChatMessages((current) => [
        ...current,
        userMessage,
        {
          id: nextMessageId('coach'),
          role: 'coach',
          timestamp: localTime(),
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
        timestamp: localTime(),
        response: geminiResponse,
      },
    ])
    setIsAIThinking(false)
  }

  function submitMessage(event) {
    event.preventDefault()
    askQuestion(message)
  }

  function handleComposerKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      askQuestion(message)
    }
  }

  function clearConversation() {
    if (!chatMessages.length || !window.confirm('Clear this Health AI conversation?')) return
    setChatMessages([])
    setCopiedMessageId(null)
    shouldAutoScrollRef.current = true
  }

  async function copyResponse(chatMessage) {
    const response = chatMessage.response
    const visibleText = [
      response.main,
      response.steps?.length ? `Coach's Next Step\n${response.steps.join('\n')}` : '',
      response.examples?.length ? `Try asking:\n${response.examples.join('\n')}` : '',
    ].filter(Boolean).join('\n\n')

    try {
      await navigator.clipboard.writeText(visibleText)
      setCopiedMessageId(chatMessage.id)
      window.setTimeout(() => setCopiedMessageId((current) => current === chatMessage.id ? null : current), 1600)
    } catch {
      setCopiedMessageId(null)
    }
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
    <section className="mx-auto w-full max-w-7xl overflow-x-clip px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <header className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12351f] p-5 shadow-2xl shadow-black/25 sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#ffdd33]">
              Fit Minds
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Health AI
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/70 sm:text-base">
              Practical fitness and wellness guidance, built around your everyday goals.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-white/75">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#75ff38] shadow-[0_0_10px_#75ff38]" />
              Programmed Coach + AI Support
            </span>
          </div>
          <div className="hidden rounded-2xl bg-[#75ff38] p-4 text-black sm:block">
            <CoachIcon path="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
          </div>
        </div>
      </header>

      <div className="mt-7 flex items-end justify-between gap-4 px-1">
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

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        {coachCards.map((coach) => {
          const isSelected = selectedCoach === coach.title

          return (
            <button
              aria-pressed={isSelected}
              className={`group min-h-32 rounded-2xl border p-3.5 text-left shadow-lg transition duration-200 hover:-translate-y-0.5 hover:border-[#75ff38]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050805] motion-reduce:transform-none motion-reduce:transition-none active:scale-[0.98] ${
                isSelected
                  ? 'border-[#75ff38] bg-[#75ff38] text-black shadow-[#75ff38]/15'
                  : 'border-white/10 bg-white text-[#12351f] shadow-black/20'
              }`}
              key={coach.title}
              onClick={() => setSelectedCoach(coach.title)}
              type="button"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  isSelected ? 'bg-black text-[#75ff38]' : 'bg-[#eefbe8] text-[#12351f] group-hover:bg-[#75ff38]'
                }`}
              >
                <CoachIcon path={coach.icon} />
              </span>
              <span className="mt-3 block text-sm font-black leading-5">{coach.title}</span>
              <span className={`mt-0.5 hidden text-[11px] font-semibold leading-4 sm:block ${isSelected ? 'text-black/65' : 'text-black/55'}`}>
                {coach.description}
              </span>
            </button>
          )
        })}
      </div>

      <div className={`mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-opacity sm:p-5 ${chatMessages.length ? 'opacity-75' : ''}`}>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffdd33]">
          Try asking about {selectedCoach}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.slice(0, chatMessages.length ? 2 : 4).map((question) => (
            <button
              className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-left text-xs font-bold text-white/80 transition hover:border-[#75ff38] hover:bg-[#75ff38] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] motion-reduce:transition-none active:scale-95 disabled:cursor-wait disabled:opacity-50"
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

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="order-2 rounded-3xl bg-white p-5 text-black shadow-xl shadow-black/20 sm:p-6 lg:sticky lg:top-6">
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

        <article className="order-1 flex h-[36rem] min-w-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12351f] shadow-2xl shadow-black/30 sm:h-[42rem]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#75ff38] text-black">
              <CoachIcon path="M21 12a8 8 0 0 1-8 8H6l-3 2 1-5a8 8 0 1 1 17-5Zm-12-1h6m-6 4h4" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-white sm:text-xl">Ask Health AI</h2>
              <p className="truncate text-xs font-bold text-[#75ff38]">Your hybrid fitness coach</p>
            </div>
            </div>
            <button
              aria-label="Clear Health AI conversation"
              className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-black text-white/70 transition hover:border-red-300/50 hover:bg-red-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!chatMessages.length || isAIThinking}
              onClick={clearConversation}
              type="button"
            >
              Clear <span className="hidden sm:inline">Conversation</span>
            </button>
          </div>

          <div
            aria-live="polite"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 pb-8 pt-5 sm:max-h-[38rem] sm:px-5"
            onScroll={trackMessageScroll}
            ref={messageAreaRef}
          >
            {chatMessages.length === 0 ? (
              <div className="m-auto w-full max-w-lg py-4 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#75ff38] text-[#12351f] shadow-lg shadow-[#75ff38]/15">
                  <CoachIcon path="M12 3v3m0 12v3M3 12h3m12 0h3M7.8 7.8l-2-2m10.4 2 2-2m-2 10.4 2 2m-10.4-2-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                </span>
                <p className="mt-4 text-lg font-black text-white">Ready when you are.</p>
                <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-white/60">
                  Ask for practical guidance on training, nutrition, walking, hydration, or recovery.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {welcomePrompts.map((prompt) => (
                    <button
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs font-bold leading-5 text-white/75 transition hover:border-[#75ff38]/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33]"
                      key={prompt}
                      onClick={() => askQuestion(prompt)}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-[11px] font-semibold leading-5 text-white/40">
                  General fitness guidance only — Health AI does not provide medical diagnosis.
                </p>
              </div>
            ) : (
              chatMessages.map((chatMessage) => {
                const response = chatMessage.response

                if (chatMessage.role === 'user') {
                  return (
                    <div className="ml-auto h-auto max-w-[88%] overflow-visible rounded-2xl rounded-br-md bg-gradient-to-br from-[#216f3e] to-[#12351f] px-4 py-3 text-sm font-semibold leading-6 text-white shadow-md [overflow-wrap:anywhere] sm:max-w-[78%]" key={chatMessage.id}>
                      <p className="whitespace-pre-wrap">{chatMessage.text}</p>
                      <p className="mt-1 text-right text-[10px] font-bold text-white/45">{chatMessage.timestamp}</p>
                    </div>
                  )
                }

                const isUrgent = response.type === 'urgent'
                const isWarning = ['ai-unavailable', 'ai-error', 'unsafe-output'].includes(response.type)
                const badge = isUrgent
                  ? 'Safety Alert'
                  : response.type === 'gemini'
                    ? 'AI Assisted'
                    : isWarning
                      ? 'Coach Notice'
                      : 'Programmed Coach'

                return (
                  <div className="flex max-w-full items-start gap-2.5 sm:max-w-[92%]" key={chatMessage.id}>
                    <AssistantAvatar urgent={isUrgent} />
                    <div className={`h-auto min-w-0 flex-1 overflow-visible rounded-2xl rounded-bl-md border px-4 py-3 text-sm font-semibold leading-6 shadow-md [overflow-wrap:anywhere] ${
                      isUrgent
                        ? 'border-red-300 bg-red-50 text-red-950'
                        : isWarning
                          ? 'border-amber-200 bg-amber-50 text-amber-950'
                          : 'border-black/5 bg-white text-[#12351f]'
                    }`}>
                      <div className="mb-2 flex items-center justify-between gap-3 border-b border-black/10 pb-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] ${isUrgent ? 'bg-red-100 text-red-700' : isWarning ? 'bg-amber-100 text-amber-800' : 'bg-[#eefbe8] text-[#17552e]'}`}>
                          {badge}
                        </span>
                        <span className="text-[10px] font-bold text-current opacity-45">{chatMessage.timestamp}</span>
                      </div>
                      <div className="h-auto overflow-visible">
                        <FormattedResponse text={response.main} />
                        {response.steps.length > 0 && (
                          <div className="mt-4 rounded-xl bg-[#eefbe8] p-3">
                            <p className="font-black">Coach&apos;s Next Step</p>
                            <ul className="mt-2 space-y-1.5">
                              {response.steps.map((step) => <li className="flex gap-2" key={step}><span aria-hidden="true" className="text-green-700">✓</span><span>{step}</span></li>)}
                            </ul>
                          </div>
                        )}
                        {response.examples?.length > 0 && (
                          <div className="mt-3 border-t border-black/10 pt-3">
                            <p className="font-black">Try asking:</p>
                            <ul className="mt-1 space-y-1 text-[#12351f]/75">
                              {response.examples.map((example) => <li className="flex gap-2" key={example}><span aria-hidden="true">•</span><span>{example}</span></li>)}
                            </ul>
                          </div>
                        )}
                        {response.links.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {response.links.map((link) => (
                              <Link
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#12351f] px-3 py-1.5 text-xs font-black text-white transition hover:bg-[#194a2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdd33]"
                                key={link}
                                to={link}
                              >
                                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d={featureLinkDetails[link]?.icon ?? 'M5 12h14M12 5l7 7-7 7'} /></svg>
                                {featureLinkDetails[link]?.label ?? 'Open feature'}
                              </Link>
                            ))}
                          </div>
                        )}
                        <button
                          aria-label={copiedMessageId === chatMessage.id ? 'Response copied' : 'Copy response'}
                          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-black text-current opacity-55 transition hover:bg-black/5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                          onClick={() => copyResponse(chatMessage)}
                          type="button"
                        >
                          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 8h11v11H8zM5 16H4V5a1 1 0 0 1 1-1h11v1" /></svg>
                          {copiedMessageId === chatMessage.id ? 'Copied' : 'Copy response'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            {isAIThinking && (
              <div className="flex items-start gap-2.5" role="status">
                <AssistantAvatar />
                <div className="h-auto w-fit overflow-visible rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm font-bold text-[#12351f] shadow-md">
                  <span className="inline-flex items-center gap-2" aria-label="Health AI is thinking">
                    <span className="flex gap-1 motion-reduce:hidden">
                      {[0, 1, 2].map((dot) => (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-[#12351f]/55 motion-reduce:animate-none" key={dot} style={{ animationDelay: `${dot * 140}ms` }} />
                      ))}
                    </span>
                    Health AI is thinking
                  </span>
                </div>
              </div>
            )}
            <div aria-hidden="true" className="h-px shrink-0" ref={messagesEndRef} />
          </div>

          <form className="flex items-end gap-2 border-t border-white/10 bg-black/10 p-3 sm:p-4" onSubmit={submitMessage}>
            <label className="sr-only" htmlFor="coach-message">Ask Health Coach AI</label>
            <textarea
              className="max-h-32 min-h-12 min-w-0 flex-1 resize-y rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/40 focus:border-[#75ff38] focus:ring-2 focus:ring-[#75ff38]/30"
              id="coach-message"
              disabled={isAIThinking}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask about fitness, nutrition, recovery, walking, or healthy habits..."
              rows="1"
              value={message}
            />
            <button
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#ffdd33] px-3 text-sm font-black text-black transition hover:bg-[#ffe866] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none active:scale-95 disabled:cursor-wait disabled:opacity-50 sm:px-5"
              disabled={isAIThinking || !message.trim()}
              type="submit"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" /></svg>
              <span className="hidden sm:inline">Send</span>
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
