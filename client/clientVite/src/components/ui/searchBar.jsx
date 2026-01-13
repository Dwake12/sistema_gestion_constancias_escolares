function SearchBar({ placeholder = "Buscar...", value, onChange, onSearch }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                className="search-input"
            />
            {onSearch && (
                <button 
                    type="button" 
                    onClick={() => onSearch(value)}
                    className="search-button"
                >
                    🔍
                </button>
            )}
        </div>
    )
}

export default SearchBar