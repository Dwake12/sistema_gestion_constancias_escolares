import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../../components/ui/icon.jsx'
import Button from '../../components/ui/button.jsx'
import headerIcon from '../../assets/login_icon.svg'

import '../../styles/layout.css'

function Header({ page }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    // Funcion para cerrar sesion
    function handleLogout() {
        logout() // Limpia el estado del usuario (CERRAR SESION)
        navigate('/login') // Redirige al login
    }
    // Funcion para regresar al Dashboard
    function handleDashboard() {
        navigate('/dashboard') // Redirige al dashboard
    }

    return (
        <div className='header'>
            <div className="header-logo">
                <Icon
                    srcIcon={headerIcon}
                    styleIcon="header-logo-icon"
                />
                <div className="header-text">
                    <h2>Sistema de Constancias</h2>
                    <p>{`Usuario: ${user.role}`}</p>
                </div>
            </div>
            <div className="header-logout">
                {page === 'dashboard' ? (
                    <Button
                        iconButton={page}
                        label="Cerrar Sesion"
                        styleButton="button-header"
                        onClick={handleLogout}
                    />
                ) : (
                    <Button
                        iconButton={page}
                        label="Volver"
                        styleButton="button-header"
                        onClick={handleDashboard}
                    />
                )}
            </div>
        </div>
    )
}

export default Header
