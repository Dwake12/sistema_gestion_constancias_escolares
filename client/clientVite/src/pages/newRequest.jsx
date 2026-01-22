import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/header'
import Input from '../components/ui/Input'
import Button from '../components/ui/button.jsx'
import Select from '../components/ui/select.jsx'

import '../styles/styles_pages/newRequest.css'

// Opcions selects
const typesOfRecords = [
    { value: 'withdrawal', label: 'Retiro' },
    { value: 'conduct', label: 'Buena Conducta' },
    { value: 'administrative-solvency', label: 'Solvencia Administrativa' }
]

const documentTypes = [
    {value: 'ci', label: 'C.I'},
    {value: 'ce', label: 'C.E'}
]

const academicLevels = [
    {value: 'Preschool', label: 'Preescolar'},
    {value: 'Primary-education', label: 'Educacion Primaria'},
    {value: 'General-secundary-education', label: 'Educacion Media general'}
]

const academicDegrees = [
    { value: 'level-1', label: 'l Nivel' },
    { value: 'level-2', label: 'll Nivel' },
    { value: 'level-3', label: 'lll Nivel' },
    { value: 'first-grade', label: '1er Grado' },
    { value: 'second-grade', label: '2do Grado' },
    { value: 'fourth-grade', label: '4to Grado' },
    { value: 'fifth-grade', label: '5to Grado' },
    { value: 'sixth-grade', label: '6to Grado' },
    { value: 'first-year', label: '1er Año' },
    { value: 'second-year', label: '2 Año' },
    { value: 'third-year', label: '3 Año' },
    { value: 'fourth-year', label: '4 Año' },
    { value: 'fifth-year', label: '5 Año' }
]

function NewRequest() {
    const { user } = useAuth()

    const [filtertypesOfRecords, settypesOfRecords] = useState()
    const [filterdocumentTypes, setdocumentTypes] = useState()
    const [filerAcademicLevels, setAcademicLevels] = useState()
    const [filteracademicDegrees, setacademicDegrees] = useState()

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        if (name === 'certificateType') settypesOfRecords(value)
        if (name === 'docType') setdocumentTypes(value)
        if (name === 'academicLevel') setAcademicLevels(value)
        if (name === 'academicDegrees') setacademicDegrees(value)
    }

    return (
        <main className='container-newRequest'>
            <Header
                page="newRequest"
            />
            <div className='container-main-content-newRequest'>
                <div className='container-form-newRequest'>
                    <div className='container-form-title'>
                        <h2>Solicitud de Constancia</h2>
                    </div>
                    <form className='form-newRequest' action="">
                        <div className='student-data-container container-data'>
                            <h3>Datos del estudiante</h3>
                            <Input 
                                label="Nombres y Apellidos" 
                                type="text"
                                styleInput="large" 
                            />

                            <Select
                                label="Tipo de documento" 
                                placeholder="Tipo de constancia"
                                options={documentTypes}
                                value={filterdocumentTypes}
                                onChange={handleFilterChange}
                                name="filter"
                                id="filter-select"
                            />

                            <Input 
                                label="Numero de documento" 
                                type="number" 
                            />

                            <Select
                                label="Nivel academico" 
                                placeholder="Tipo de constancia"
                                options={academicLevels}
                                value={filerAcademicLevels}
                                onChange={handleFilterChange}
                                name="filter"
                                id="filter-select"
                            />

                            <Select
                                label="Grado/Ano" 
                                placeholder="Tipo de constancia"
                                options={academicDegrees}
                                value={filteracademicDegrees}
                                onChange={handleFilterChange}
                                name="filter"
                                id="filter-select"
                            />
                        </div>

                        <div className='payment-data-container container-data'>
                            <h3 className='large'>Datos del pago</h3>
                            <Input 
                                label="Fecha del pago" 
                                type="date" 
                            />

                            <Input 
                                label="Nro de Referencia"
                                type="number"
                            />

                            <Input 
                                label="Monto (bs)" 
                                type="number" 
                            />
                        </div>

                        <div className='record-data-container container-data'>
                            <h3 className='large'>Datos de la constancia</h3>
                            <Select
                                label="Tipo de constancia" 
                                placeholder="Tipo de constancia"
                                options={typesOfRecords}
                                value={filtertypesOfRecords}
                                onChange={handleFilterChange}
                                name="filter"
                                id="filter-select"
                            />

                            <Input 
                                label="Nombre y apellido del representante legal"
                                type="text"
                            />

                            <Input 
                                label="C.I del representante legal"
                                type="number"
                            />

                        </div>

                    </form>
                    <div className='container-footer-form'>
                        <Button 
                            label="Generar Solicitud"
                            styleButton="button-form"
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NewRequest