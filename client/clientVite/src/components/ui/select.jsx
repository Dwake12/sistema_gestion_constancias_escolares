function Select({
    placeholder = 'Selecciona una opción',
    options = [],
    value,
    onChange,
    name,
    id,
    className = ''
}) {
    return (
            <select
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
    )
}

export default Select