function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  min,
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#12351f]">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-[#12351f]/15 bg-white px-4 py-3 text-base font-semibold text-black outline-none transition focus:border-[#75ff38] focus:ring-4 focus:ring-[#75ff38]/20"
        min={min}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  )
}

export default FormField
