import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/header'
import CardButton from '../components/ui/cardbutton.jsx'
import createIcon from '../assets/create_icon.svg'
import viewIcon from '../assets/view_icon.svg'
import perfilIcon from '../assets/perfil_icon.svg'

import '../styles/styles_pages/dashboard.css'

function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    function handleNavigation(button) {
        const routes = {
            'newRequest': '/newRequest',
            'viewRequest': '/viewRequest',
            'userManagement': '/userManagement'
        }
        
        const route = routes[button]
        if (route) {
            navigate(route)
        }
    }

    const renderButtonsByRole = () => {
        switch(user?.role) {
            case 'root':
                return (
                    <>
                        <CardButton
                            icon={createIcon}
                            tittle="Nueva solicitud"
                            description="Genera una nueva solicitud de constancia"
                            styleCardButton="first-card-button"
                            iconStyle="first-card-icon"
                            iconStyleImg="first-card-icon-img"
                            onClick={() => handleNavigation('newRequest')}
                        />
                        <CardButton
                            icon={viewIcon}
                            tittle="Ver solicitudes"
                            description="Administrar y procesar solicitudes"
                            styleCardButton="second-card-button"
                            iconStyle="second-card-icon"
                            iconStyleImg="second-card-icon-img"
                            onClick={() => handleNavigation('viewRequest')}
                        />
                        <CardButton
                            icon={perfilIcon}
                            tittle="Gestion de usuarios"
                            description="Administrar usuarios y roles"
                            styleCardButton="third-card-button"
                            iconStyle="third-card-icon"
                            iconStyleImg="third-card-icon-img"
                            onClick={() => handleNavigation('userManagement')}
                        />
                    </>
                )
            case 'admintrator':
                return (
                    <>
                        <CardButton
                            icon={createIcon}
                            tittle="Nueva solicitud"
                            description="Genera una nueva solicitud de constancia"
                            styleCardButton="first-card-button"
                            iconStyle="first-card-icon"
                            iconStyleImg="first-card-icon-img"
                            onClick={() => handleNavigation('newRequest')}
                        />
                        <CardButton
                            icon={viewIcon}
                            tittle="Ver solicitudes"
                            description="Administrar y procesar solicitudes"
                            styleCardButton="second-card-button"
                            iconStyle="second-card-icon"
                            iconStyleImg="second-card-icon-img"
                            onClick={() => handleNavigation('viewRequest')}
                        />
                    </>
                )
            case 'secretariat':
                return (
                    <>
                        <CardButton
                            icon={createIcon}
                            tittle="Nueva solicitud"
                            description="Genera una nueva solicitud de constancia"
                            styleCardButton="first-card-button"
                            iconStyle="first-card-icon"
                            iconStyleImg="first-card-icon-img"
                            onClick={() => handleNavigation('newRequest')}
                        />
                    </>
                )
            default:
                return null
        }
    }

    return (
        <main className='container-dashboard'>
            <Header
                page="dashboard" 
            />
            <div className="container-dashboard-main-content">
                <div className='container-dashboard-welcome-text'>
                    <h2>Bienvenido</h2>
                    <p>{user.role}</p>
                </div>
                <div className='container-dashboard-cardsButtons'>
                    {renderButtonsByRole()}
                </div>  
            </div>
        </main>
    )
}

export default Dashboard