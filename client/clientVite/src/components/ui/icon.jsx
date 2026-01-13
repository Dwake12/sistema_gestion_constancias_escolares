function Icon ({srcIcon, styleIcon}) {
    return (
        <div className={`icon ${styleIcon || ''}`}>
            <img className="img-icon" src={srcIcon} alt="Logo" />
        </div>
    )
}

export default Icon