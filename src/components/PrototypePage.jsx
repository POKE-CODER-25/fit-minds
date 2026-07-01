function PrototypePage({ title }) {
  return (
    <section className="mx-auto flex min-h-full w-full max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full rounded-3xl bg-white p-8 text-center text-black shadow-xl shadow-black/20 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#75ff38]">
          Prototype Version
        </p>
        <h1 className="mt-4 text-3xl font-black text-[#12351f] sm:text-4xl">
          {title}
        </h1>
      </div>
    </section>
  )
}

export default PrototypePage
