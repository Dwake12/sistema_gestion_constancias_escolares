import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/layout/header'
import Table from '../components/ui/table'

import '../styles/styles_pages/userManagement.css'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const headerTable = [
    { header: "Usuario", accessor: "username" },
    { header: "Rol", accessor: "role" },
    { header: "Activo", accessor: "is_active" },
]

function UserManagement () {
    const { user } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(`${API_URL}/users`)
            const data = await res.json()

            if(!res.ok) {
                throw new Error(data.message || "Error al obtener usuarios")
            }

            setUsers(data.users)
        } catch(err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container-viewRequest-userManagement">
            < Header 
                page="userManagement"
            />
            <div className="container-main-content-userManagement">
                <div className='container-list-users'>
                    <div className='container-list-tittle-users'>
                        <h2>Usuarios</h2>
                    </div>
                    <div className='table-users'>
                        <Table 
                            columns={headerTable}
                            data={users}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default UserManagement