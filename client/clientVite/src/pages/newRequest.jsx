import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import Header from '../components/layout/header'
import Input from '../components/ui/Input'
import Button from '../components/ui/button.jsx'
import Select from '../components/ui/select.jsx'

import '../styles/styles_pages/newRequest.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Opcions selects
const documentTypes = [
    {value: 'ci', label: 'C.I'},
    {value: 'ce', label: 'C.E'}
]

const academicLevels = [
    {value: 'EDUCACION INICIAL', label: 'Preescolar'},
    {value: 'EDUCACION PRIMARIA', label: 'Educación Primaria'},
    {value: 'EDUCACION MEDIA GENERAL', label: 'Educación Media General'}
]

const academicDegrees = [
    { value: 'I NIVEL', label: 'I Nivel' },
    { value: 'II NIVEL', label: 'II Nivel' },
    { value: 'III NIVEL', label: 'III Nivel' },
    { value: '1ER GRADO', label: '1er Grado' },
    { value: '2DO GRADO', label: '2do Grado' },
    { value: '4TO GRADO', label: '4to Grado' },
    { value: '5TO GRADO', label: '5to Grado' },
    { value: '6TO GRADO', label: '6to Grado' },
    { value: '1ER AÑO', label: '1er Año' },
    { value: '2DO AÑO', label: '2do Año' },
    { value: '3RO AÑO', label: '3ro Año' },
    { value: '4TO AÑO', label: '4to Año' },
    { value: '5TO AÑO', label: '5to Año' }
]

const academycYear = [
    { value: '2024-2025', label: '2024-2025' },
    { value: '2025-2026', label: '2025-2026' }
]

const typesOfRecords = [
    { value: 'ESTUDIO', label: 'Estudio' },
    { value: 'RETIRO', label: 'Retiro' },
    { value: 'BUENA CONDUCTA', label: 'Buena Conducta' },
    { value: 'SOLVENCIA ADMINISTRATIVA', label: 'Solvencia Administrativa' }
]

const months = [
    { value: 'ENERO', label: 'Enero' },
    { value: 'FEBRERO', label: 'Febrero' },
    { value: 'MARZO', label: 'Marzo' },
    { value: 'ABRIL', label: 'Abril' },
    { value: 'MAYO', label: 'Mayo' },
    { value: 'JUNIO', label: 'Junio' },
    { value: 'AGOSTO', label: 'Agosto' },
    { value: 'SEPTIEMBRE', label: 'Septiembre' },
    { value: 'OCTUBRE', label: 'Octubre' },
    { value: 'NOVIEMBRE', label: 'Noviembre' },
    { value: 'DICIEMBRE', label: 'Diciembre' }


]

function NewRequest() {
    const { user } = useAuth()

    // Estados de los selects
    const [filterdocumentTypes, setDocumentTypes] = useState('')
    const [filerAcademicLevels, setAcademicLevels] = useState('')
    const [filterAcademicDegrees, setAcademicDegrees] = useState('')
    const [filterAcademycYear, setAcademycYear] = useState('')
    const [filterTypesOfRecords, setTypesOfRecords] = useState('')
    const [filterMonths, setMonths] = useState('')

    // Estados de los inputs datos del estudiante
    const [studentName, setStudentName] = useState('')
    const [documentNumber, setDocumentNumber] = useState('')

    // Estados de los inputs de pago
    const [paymentDate, setPaymentDate] = useState('')
    const [paymentReference, setPaymentReference] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')

    // Estados de los inputs del representante legal
    const [legalRepresentativeName, setLegalRepresentativeName] = useState('')
    const [legalRepresentativeCI, setLegalRepresentativeCI] = useState('')

    // Estado del envío del formulario
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Scroll al inicio cuando se monta el componente
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        if (name === 'documentTypes') setDocumentTypes(value)
        if (name === 'academicLevels') setAcademicLevels(value)
        if (name === 'academicDegrees') setAcademicDegrees(value)
        if (name === 'academycYear') setAcademycYear(value)
        if (name === 'certificateType') setTypesOfRecords(value)
        if (name === 'months') setMonths(value)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'studentName') setStudentName(value)
        if (name === 'documentNumber') setDocumentNumber(value)
        if (name === 'paymentDate') setPaymentDate(value)
        if (name === 'paymentReference') setPaymentReference(value)
        if (name === 'paymentAmount') setPaymentAmount(value)
        if (name === 'legalRepresentativeName') setLegalRepresentativeName(value)
        if (name === 'legalRepresentativeCI') setLegalRepresentativeCI(value)
    }

    const buildExtraData = () => {
        if (filterTypesOfRecords === 'RETIRO' || filterTypesOfRecords === 'SOLVENCIA ADMINISTRATIVA') {
            const extra = {
                'paret-name': legalRepresentativeName,
                'parent-ci': legalRepresentativeCI,
            }
            if (filterTypesOfRecords === 'SOLVENCIA ADMINISTRATIVA' && filterMonths) {
                extra.solvent_month = filterMonths
            }
            return extra
        }
        return {}
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(null)
        setSubmitSuccess(false)
        setSubmitting(true)
        try {
            const extra_data = buildExtraData()
            const body = {
                record_type: filterTypesOfRecords,
                student_full_name: studentName.trim(),
                student_document_type: filterdocumentTypes,
                student_number_document: String(documentNumber).trim(),
                student_academic_level: filerAcademicLevels,
                student_academic_degrees: filterAcademicDegrees,
                student_academic_year: filterAcademycYear,
                pay_date: paymentDate,
                pay_reference: String(paymentReference).trim(),
                pay_amount: Number(paymentAmount),
                extra_data,
            }
            const res = await fetch(`${API_URL}/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al crear la solicitud')
            setSubmitSuccess(true)
            setStudentName('')
            setDocumentNumber('')
            setDocumentTypes('')
            setAcademicLevels('')
            setAcademicDegrees('')
            setAcademycYear('')
            setTypesOfRecords('')
            setPaymentDate('')
            setPaymentReference('')
            setPaymentAmount('')
            setLegalRepresentativeName('')
            setLegalRepresentativeCI('')
            setMonths('')
            toast.success('Solicitud creada correctamente')
        } catch (err) {
            toast.error(err.message || 'Error al crear la solicitud')
        } finally {
            setSubmitting(false)
        }
    }

    const renderCertificateFields = () => {
        switch (filterTypesOfRecords) {
            case '':
                return null

            // Ajusta estos casos según tus templates / tipos reales
            case 'RETIRO':
                return (
                    <>
                        <Input
                            label="Nombre y apellido del representante legal"
                            type="text"
                            name="legalRepresentativeName"
                            value={legalRepresentativeName}
                            onChange={handleInputChange}
                        /> 
                        <Input
                            label="C.I del representante legal"
                            type="number"
                            name="legalRepresentativeCI"
                            value={legalRepresentativeCI}
                            onChange={handleInputChange}
                        />
                    </>
                )
            case 'SOLVENCIA ADMINISTRATIVA':
                return (
                    <>
                        <Input
                            label="Nombre y apellido del representante legal"
                            type="text"
                            name="legalRepresentativeName"
                            value={legalRepresentativeName}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="C.I del representante legal"
                            type="number"
                            name="legalRepresentativeCI"
                            value={legalRepresentativeCI}
                            onChange={handleInputChange}
                        />
                        <Select 
                            label="Mes solvente" 
                            placeholder="Ultimo mes solvente"
                            options={months}
                            value={filterMonths}
                            onChange={handleFilterChange}
                            name="months"
                            id="filter-select"
                        />
                    </>
                )
                
            default:
                return null
        }
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
                    <form className='form-newRequest' onSubmit={handleSubmit}>
                        <div className='student-data-container container-data'>
                            <h3>Datos del estudiante</h3>
                            <Input 
                                label="Nombres y Apellidos" 
                                type="text"
                                styleInput="large"
                                name="studentName"
                                value={studentName}
                                onChange={handleInputChange}
                            />

                            <Select
                                label="Tipo de documento" 
                                placeholder="Selecciones tipo de documento"
                                options={documentTypes}
                                value={filterdocumentTypes}
                                onChange={handleFilterChange}
                                name="documentTypes"
                                id="filter-select"
                            />

                            <Input 
                                label="Numero de documento" 
                                type="number"
                                name="documentNumber"
                                value={documentNumber}
                                onChange={handleInputChange}
                            />

                            <Select
                                label="Nivel academico" 
                                placeholder="Seleccione nivel academico"
                                options={academicLevels}
                                value={filerAcademicLevels}
                                onChange={handleFilterChange}
                                name="academicLevels"
                                id="filter-select"
                            />

                            <Select
                                label="Grado / Año" 
                                placeholder="Seleccione el Grado / Año"
                                options={academicDegrees}
                                value={filterAcademicDegrees}
                                onChange={handleFilterChange}
                                name="academicDegrees"
                                id="filter-select"
                            />

                            <Select
                                label="Año escolar" 
                                placeholder="Seleccione el Ano escolar"
                                options={academycYear}
                                value={filterAcademycYear}
                                onChange={handleFilterChange}
                                name="academycYear"
                                id="filter-select"
                            />
                        </div>

                        <div className='payment-data-container container-data'>
                            <h3 className='large'>Datos del pago</h3>
                            <Input 
                                label="Fecha del pago" 
                                type="date"
                                name="paymentDate"
                                value={paymentDate}
                                onChange={handleInputChange}
                            />

                            <Input 
                                label="Referencia"
                                type="number"
                                name="paymentReference"
                                value={paymentReference}
                                onChange={handleInputChange}
                            />

                            <Input 
                                label="Monto (bs)" 
                                type="number"
                                name="paymentAmount"
                                value={paymentAmount}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='record-data-container container-data'>
                            <h3 className='large'>Datos de la constancia</h3>
                            <Select
                                label="Tipo de constancia" 
                                placeholder="Tipo de constancia"
                                options={typesOfRecords}
                                value={filterTypesOfRecords}
                                onChange={handleFilterChange}
                                name="certificateType"
                                id="filter-select"
                            />

                            {renderCertificateFields()}

                        </div>

                        <div className='container-footer-form'>
                            <Button 
                                label="Generar Solicitud"
                                styleButton="button-form"
                                type="submit"
                                loading={submitting}
                                disabled={submitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default NewRequest