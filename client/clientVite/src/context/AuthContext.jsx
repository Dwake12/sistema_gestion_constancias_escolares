import { createContext, useContext, useState, useEffect } from "react";

/**
 * ========================================
 * AUTHCONTEXT - GUÍA DE USO
 * ========================================
 * 
 * ¿Qué es AuthContext?
 * --------------------
 * Es un "almacén global" de React que permite compartir el estado de autenticación
 * (usuario, funciones de login/logout) entre TODOS los componentes de tu aplicación
 * sin tener que pasar props manualmente.
 * 
 * ¿Cómo funciona?
 * ---------------
 * 1. AuthProvider envuelve toda la app (en main.jsx) y "provee" el contexto
 * 2. Cualquier componente puede usar useAuth() para acceder a:
 *    - user: el usuario autenticado (null si no hay usuario)
 *    - login(): función para iniciar sesión
 *    - logout(): función para cerrar sesión
 * 
 * ¿Cuándo usar useAuth()?
 * ------------------------
 * - En páginas que necesitan saber si hay usuario autenticado
 * - En componentes que muestran información del usuario (ej: Header)
 * - En páginas de login para hacer login
 * - En componentes que necesitan hacer logout
 * 
 * ¿Dónde NO usar useAuth()?
 * --------------------------
 * - En componentes que no necesitan información de autenticación
 * - Fuera de componentes de React (no funcionará)
 */
// Creamos el contexto
const AuthContext = createContext(null); // <-- Inicialmente podemos colocarlo en null
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

/**
 * AuthProvider - El "proveedor" del contexto
 * 
 * Este componente debe envolver TODA tu aplicación (ya lo hace en main.jsx)
 * 
 * Proporciona:
 * - user: Estado del usuario (null o objeto con {name, role})
 * - login: Función para iniciar sesión
 * - logout: Función para cerrar sesión
 */
export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true)
    

    useEffect(() => {
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")

        if(savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }

        setLoadingAuth(false)
    }, [])

    //Login
    async function login(username, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        const data = await res.json()
        console.log(data)

        if(!res.ok){
            throw new Error(data.message || "Error al iniciar sesión")
        }

        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("token", data.token);

        return true
    }

    //Logout
    function logout() {
        setUser(null)
        setToken(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }

    // Provider (Es el que se encarga de proveer las variables que estan en value a todo el proyecto para que se puedan a accer a ellas desde donde sea, siempre y cuando este envuelta en la etiqueta <AuthProvider>)
    return (
        <AuthContext.Provider value={{ user, token, login, logout, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Hook personalizado para usar el contexto de autenticación
 * 
 * USO:
 * -----
 * import { useAuth } from '../context/AuthContext'
 * 
 * function MiComponente() {
 *     const { user, login, logout } = useAuth()
 *     
 *     // Ahora puedes usar:
 *     // - user para verificar si hay usuario autenticado
 *     // - login() para iniciar sesión
 *     // - logout() para cerrar sesión
 * }
 * 
 * IMPORTANTE: Solo funciona dentro de componentes que están dentro de AuthProvider
 */
export function useAuth() {
    return useContext(AuthContext)
}
