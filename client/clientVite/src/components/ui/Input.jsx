function Input({label, value, onChange, type, styleInput}) {
    return (
        <label className={`input ${styleInput || ''}`}> 
            {label}
            <input
                type={type}
                value={value}
                onChange={onChange}
                autoFocus
            />
        </label>
    )
}

export default Input
