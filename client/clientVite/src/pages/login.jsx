import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import loginIcon from '../assets/login_icon.svg'
import Input from '../components/ui/Input'
import Icon from '../components/ui/icon.jsx'
import Button from '../components/ui/button.jsx'

import '../styles/styles_pages/login.css'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { token, login } = useAuth()
    const navigate = useNavigate()

    // Si el usuario ya está autenticado, redirigir al dashboard
    useEffect(() => {
        if (token) {
            navigate('/dashboard')
        }
    }, [token, navigate])

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
    
        try {
          await login(username.trim(), password.trim());
        } catch (err) {
          setError(err.message || "Usuario o clave incorrectos");
        } finally {
          setIsLoading(false);
        }
      }

    return (
        <main className="container-login">
            <div className="card-login">

                <div className='container-icon-login'>
                    <Icon
                        srcIcon={loginIcon}
                        styleIcon="login-icon"
                    />
                </div>
                
                <div className="card__header">
                    <h2>Sistema de Constancias</h2>
                    <p>Introduce tus credenciales para acceder</p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                    <Input
                        label="Usuario"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p style={{ color: 'rgba(193, 33, 33, 0.72)', fontSize: "0.9rem"}}>{error}</p>}

                    <Button 
                        styleButton="button-login"
                        label="Acceder"
                        type="submit"
                        loading={isLoading}
                    />
                </form>
            </div>
        </main>
    )
}

export default Login
