function Input({label, value, onChange, type, styleInput, name}) {
    return (
        <label className={`input ${styleInput || ''}`}> 
            {label}
            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                autoFocus
            />
        </label>
    )
}

export default Input
