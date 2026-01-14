import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import loginIcon from '../assets/login_icon.svg'
import Input from '../components/ui/Input'
import Icon from '../components/ui/icon.jsx'

import '../styles/styles_pages/login.css'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

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
    
        try {
          await login(username.trim(), password.trim());
        } catch (err) {
          setError(err.message || "Usuario o clave incorrectos");
        }
      }

    return (
        <main className="container-login">
            <div className="card-login">
                <Icon
                    srcIcon={loginIcon}
                    styleIcon="login-icon"
                />
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

                    {error && <p style={{ color: 'crimson' }}>{error}</p>}

                    <button className="btn" type="submit">Acceder</button>
                </form>
            </div>
        </main>
    )
}

export default Login
