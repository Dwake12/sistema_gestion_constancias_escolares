import logoutIcon from '../../assets/logout_icon_black.svg'
import backRow from '../../assets/back_row_icon_black.svg'

function Button({ iconButton, label, styleButton, onClick, type = "button", loading = false, disabled, ...rest }) {

    return (
        <button
            className={`button ${styleButton || ''} ${loading ? 'button-loading' : ''}`}
            onClick={onClick}
            type={type}
            disabled={loading || disabled}
            {...rest}
        >

            {iconButton && <img src={iconButton === "dashboard" ? logoutIcon : backRow} alt="icon-button" className='icon-button' />}
            {loading && <span className="spinner" />}
            <span className="button-label">
                {loading ? 'Cargando...' : label}
            </span>
        </button>
    );
}

export default Button;