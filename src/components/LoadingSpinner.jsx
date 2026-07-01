function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-12">
      <div className="rounded-3xl bg-white p-8 text-center text-black shadow-xl shadow-black/20">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#12351f]/20 border-t-[#75ff38]" />
        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-[#12351f]">
          {label}
        </p>
      </div>
    </div>
  )
}

export default LoadingSpinner
