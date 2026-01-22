import Icon from "./icon.jsx";

function CardButton({ icon, tittle, description, styleCardButton, iconStyle, iconStyleImg, onClick}) {
    return (
        <button className={`card-button ${styleCardButton || ''}`} onClick={onClick}>
            <Icon 
                srcIcon={icon} 
                styleIcon={`card-icon ${iconStyle || ''}`}
                styleIconInside={`img-icon ${iconStyleImg || ''}`}
            />
            <h3>{tittle}</h3>
            <p>{description}</p>
        </button>
    )
}

export default CardButton
