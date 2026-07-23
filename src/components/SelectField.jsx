function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="ui-field">
      <span className="ui-field__label">{label}</span>
      <select
        className="ui-control"
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
