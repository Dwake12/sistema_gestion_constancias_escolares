function Icon ({srcIcon, styleIcon, styleIconImg}) {
    return (
        <div className={`icon ${styleIcon || ''}`}>
            <img className={styleIconImg} src={srcIcon} alt="Logo" />
        </div>
    )
}

export default Icon