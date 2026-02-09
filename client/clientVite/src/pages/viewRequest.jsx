import { useState, useEffect } from 'react'
import Header from '../components/layout/header'
import SearchBar from '../components/ui/searchBar'
import Select from '../components/ui/select'
import Table from '../components/ui/table'
import Button from '../components/ui/button'
import { toast } from 'sonner'
import deleteIcon from '../assets/delete_icon.svg'
import downloadIcon from '../assets/download_icon.svg'

import '../styles/styles_pages/viewRequest.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const filterStatus = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'rejected', label: 'Rechazadas' }
]

// Solo primera letra mayúscula para mostrar en tabla
function formatTypeLabel(value) {
    if (!value) return ''
    const lower = String(value).toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
}

// Fecha solo año, mes y día (sin hora)
function formatDateOnly(value) {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Estado en español, primera letra mayúscula
const statusLabels = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada'
}
function formatStatusLabel(value) {
    if (!value) return ''
    const key = String(value).toUpperCase()
    return statusLabels[key] ?? formatTypeLabel(value)
}

function ViewRequest() {
    const [selectedFilter, setSelectedFilter] = useState('')
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [downloadingIds, setDownloadingIds] = useState(new Set())
    const [deletingIds, setDeletingIds] = useState(new Set())

    useEffect(() => {
        fetchRecords()
    }, [])

    async function fetchRecords() {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(`${API_URL}/records`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al cargar solicitudes')
            setRecords(data.records || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDownload(row) {
        setDownloadingIds(prev => new Set(prev).add(row.id))
        try {
            const res = await fetch(`${API_URL}/records/${row.id}/pdf-url`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al obtener el PDF')
            window.open(data.url, '_blank')
            toast.success('Descarga de constancia completada')
        } catch (err) {
            console.error(err)
            toast.error(err.message || 'Error al obtener el PDF')
        } finally {
            setDownloadingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(row.id)
                return newSet
            })
        }
    }

    async function handleDelete(row) {
        if (!window.confirm(`¿Estás seguro de eliminar la solicitud de ${row.name}?`)) {
            return
        }

        setDeletingIds(prev => new Set(prev).add(row.id))
        try {
            const res = await fetch(`${API_URL}/records/${row.id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al eliminar el registro')
            
            toast.success('Registro eliminado correctamente')
            // Refrescar la lista de registros
            fetchRecords()
        } catch (err) {
            console.error(err)
            toast.error(err.message || 'Error al eliminar el registro')
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(row.id)
                return newSet
            })
        }
    }

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value)
    }

    const headerTable = [
        { header: "Nombre", accessor: "name" },
        { header: "C.I", accessor: "ci" },
        { header: "Tipo", accessor: "type" },
        { header: "Fecha", accessor: "date" },
        { header: "Referencia", accessor: "reference" },
        { header: "Monto", accessor: "amount" },
        { header: "Estado", accessor: "status" },
        {
            header: "Acciones",
            accessor: "actions",
            render: (row) => (
                <div className="table-actions-cell">
                    <Button
                        iconSrc={downloadIcon}
                        styleButton="button-action-blue"
                        onClick={() => handleDownload(row)}
                        title="Descargar"
                        loading={downloadingIds.has(row.id)}
                    />
                    <Button
                        iconSrc={deleteIcon}
                        styleButton="button-action-red"
                        onClick={() => handleDelete(row)}
                        title="Eliminar"
                        loading={deletingIds.has(row.id)}
                    />
                </div>
            )
        }
    ]

    const tableData = records.map((r) => ({
        id: r.id,
        name: r.student_full_name,
        ci: r.student_number_document,
        type: formatTypeLabel(r.record_type),
        date: formatDateOnly(r.pay_date),
        reference: r.pay_reference,
        amount: r.pay_amount,
        status: formatStatusLabel(r.status),
        pdf_path: r.pdf_path,
    }))

    return (
        <main className='container-viewRequest'>
            <Header
                page="viewRequest"
            />
            <div className='container-main-content-viewRequest'>
                <div className='container-list-viewRequest'>
                    <div className='container-list-tittle-viewRequest'>
                        <h2>Gestion de solicitud</h2>
                    </div>
                    <div className='table-viewRequest'>
                        <div className='nav-acctions-viewRequest'>
                            <SearchBar />
                            <Select
                                placeholder='Estado de constancia'
                                options={filterStatus}
                                value={selectedFilter}
                                onChange={handleFilterChange}
                                name="filter"
                                id="filter-select"
                            />
                            <Select 
                                placeholder='Tipo de constancia'
                            />
                        </div>

                        {error && <p className="table-error-message">{error}</p>}
                        <Table 
                            columns={headerTable}
                            data={tableData}
                            loading={loading}
                            loadingMessage="Cargando solicitudes..."
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ViewRequest