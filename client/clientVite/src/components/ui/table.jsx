function Table({ columns = [], data = [] }) {
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
                                <td key={colIndex}>{row[col.accessor]}</td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                            No hay datos disponibles
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default Table