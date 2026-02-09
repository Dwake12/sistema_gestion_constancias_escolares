import Loading from "./loading"

function Table({ columns = [], data = [], loading, loadingMessage = 'Cargando...' }) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {col.render
                                        ? col.render(row)
                                        : typeof row[col.accessor] === 'boolean'
                                            ? row[col.accessor] ? 'Sí' : 'No'
                                            : row[col.accessor]
                                    }
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                            {loading ? 
                            <Loading 
                                message={loadingMessage}
                            /> : 
                            'No hay datos para cargar'}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Table