function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#12351f]">{label}</span>
      <select
        className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-white px-4 py-3 text-base font-semibold text-black outline-none transition focus:border-[#75ff38] focus:ring-4 focus:ring-[#75ff38]/20"
        name={name}
        onChange={onChange}
        required
        value={value}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SelectField
