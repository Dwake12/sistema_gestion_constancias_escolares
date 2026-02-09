import logoutIcon from '../../assets/logout_icon_black.svg'
import backRow from '../../assets/back_row_icon_black.svg'

function Button({ iconButton, iconSrc, label, styleButton, onClick, type = "button", loading = false, disabled, ...rest }) {
    const iconToShow = iconSrc ?? (iconButton === "dashboard" ? logoutIcon : iconButton ? backRow : null)
    return (
        <button
            className={`button ${styleButton || ''} ${loading ? 'button-loading' : ''}`}
            onClick={onClick}
            type={type}
            disabled={loading || disabled}
            {...rest}
        >
            {iconToShow && !loading && <img src={iconToShow} alt="icon-button" className="icon-button" />}
            {loading && <span className="spinner" />}
            {(label != null && label !== '') && (
                <span className="button-label">
                    {loading ? 'Cargando...' : label}
                </span>
            )}
        </button>
    );
}

export default Button;