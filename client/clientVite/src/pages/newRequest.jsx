import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/header'
import Input from '../components/ui/Input'
import Button from '../components/ui/button.jsx'

import '../styles/styles_pages/newRequest.css'

function NewRequest() {
    const { user } = useAuth()

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
                        <h3>Datos del estudiante</h3>
                        <Input 
                            label="Nombre y apellido" 
                            type="text"
                            styleInput="large" 
                        />

                        <Input 
                            label="Fecha de nacimiento" 
                            type="date" 
                        />

                        <Input 
                            label="C.I" 
                            type="number" 
                        />

                        <Input 
                            label="Numero de telefono" 
                            type="number"
                            styleInput="large"
                        />

                        <h3 className='large'>Datos de la constancia</h3>
                        <Input 
                            label="Tipo de constancia"
                            type="text"
                        />

                        <Input 
                            label="Ano de promocion"
                            type="number"
                        />

                        <Input 
                            label="Fecha del pago"
                            type="date"
                        />

                        <Input 
                            label="Monto"
                            type="number"
                        />
                        
                        <Input 
                            label="Referencia"
                            type="number"
                        />
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