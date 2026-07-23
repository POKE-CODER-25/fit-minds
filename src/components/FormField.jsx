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
    <label className="ui-field">
      <span className="ui-field__label">{label}</span>
      <input
        className="ui-control"
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
