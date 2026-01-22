function Loading ({message = "Cargando..."}) {
    return (
        <div className="loading-container">
            <span className="spinner" />
            {message && <span className="loading-message">{message}</span>}
        </div>
    )
}

export default Loading