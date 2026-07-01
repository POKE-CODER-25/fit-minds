function CheckboxGroup({ label, name, options, values, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-black text-[#12351f]">{label}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            className="flex items-center gap-3 rounded-2xl border border-[#12351f]/10 bg-[#f7fff2] px-4 py-3 text-sm font-bold text-black shadow-sm"
            key={option}
          >
            <input
              checked={values.includes(option)}
              className="h-4 w-4 accent-[#75ff38]"
              name={name}
              onChange={() => onChange(option)}
              type="checkbox"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default CheckboxGroup
