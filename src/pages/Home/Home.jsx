const homeCards = [
  'Dashboard',
  'Pedometer',
  'Workout',
  'Diet',
  'Diet Report',
  'Health AI',
]

function Home() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white p-6 text-black shadow-xl shadow-black/20 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#75ff38]">
          Prototype Version
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#12351f]">Home</h1>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homeCards.map((card) => (
          <article
            className="min-h-36 rounded-3xl bg-[#12351f] p-6 shadow-xl shadow-black/25"
            key={card}
          >
            <h2 className="text-2xl font-black text-white">{card}</h2>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#ffdd33]">
              {card === 'Dashboard'
                ? 'Prototype Dashboard'
                : 'Prototype Version'}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Home
