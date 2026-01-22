import { useState } from 'react'
import Header from '../components/layout/header'
import SearchBar from '../components/ui/searchBar'
import Select from '../components/ui/select'
import Table from '../components/ui/table'

import '../styles/styles_pages/viewRequest.css'

const filterStatus = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'approved', label: 'Aprobadas' },
    { value: 'rejected', label: 'Rechazadas' }
]

function ViewRequest() {
    const [selectedFilter, setSelectedFilter] = useState('')

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
        { header: "Acciones", accessor: "actions" }
      ]

    // DATA TEMPORAL DE LA TABLA - Datos ficticios para pruebas (BORRAR LUEGO)
    const dataPrueba = [
        {
            name: "Juan Pérez",
            ci: "V-12345678",
            type: "Constancia de Estudios",
            date: "2024-01-15",
            reference: "REF-001234",
            amount: "50.00",
            status: "Aprobada",
            actions: "Ver | Editar"
        },
        {
            name: "María González",
            ci: "V-87654321",
            type: "Constancia de Notas",
            date: "2024-01-16",
            reference: "REF-001235",
            amount: "30.00",
            status: "Pendiente",
            actions: "Ver | Editar"
        },
        {
            name: "Carlos Rodríguez",
            ci: "V-11223344",
            type: "Constancia de Estudios",
            date: "2024-01-17",
            reference: "REF-001236",
            amount: "50.00",
            status: "Aprobada",
            actions: "Ver | Editar"
        },
        {
            name: "Ana Martínez",
            ci: "V-55667788",
            type: "Constancia de Conducta",
            date: "2024-01-18",
            reference: "REF-001237",
            amount: "25.00",
            status: "Rechazada",
            actions: "Ver | Editar"
        }
    ]

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

                        < Table 
                            columns={headerTable}
                            data={dataPrueba}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ViewRequest