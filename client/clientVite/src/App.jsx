import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login' 
import Dashboard from './pages/Dashboard'
import NewRequest from './pages/newRequest'
import ViewRequest from './pages/viewRequest'
import ProtectedRoute from './components/routes/ProtectedRoute'

function App() {

  return (
    <Routes>
      {/* Ruta pública - cualquiera puede acceder */}
      <Route 
        path="/login" 
        element={<Login />} 
      />
      
      {/* Rutas protegidas - solo usuarios autenticados */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/newRequest" 
        element={
          <ProtectedRoute>
            <NewRequest />
          </ProtectedRoute>
        } 
      />

      <Route 
        path='/viewRequest'
        element={
          <ProtectedRoute>
            <ViewRequest />
          </ProtectedRoute>
        }
      />
      
      {/* Redirigir la raíz a login por defecto */}
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
    </Routes>
  )
}

export default App
