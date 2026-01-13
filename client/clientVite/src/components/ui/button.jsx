

function Button({ icon, label, styleButton, onClick }) {
    return (
        <button className={`button ${styleButton || ''}`} onClick={onClick}>
            {icon && <img src={icon} alt="#" />}
            {label}
        </button>
    )
}

export default Button