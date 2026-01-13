# 📚 Guía Completa de AuthContext

## ¿Qué es AuthContext?

**AuthContext NO es una API REST**, es el **Context API de React** - un mecanismo para compartir estado (datos) entre componentes sin pasar props manualmente.

Imagínalo como un "almacén global" que todos los componentes pueden acceder.

---

## 🏗️ Estructura de tu Código Actual

### 1. **AuthContext.jsx** - El "Almacén"
```javascript
// Aquí defines:
// - El estado del usuario (user)
// - Las funciones login() y logout()
// - El Provider que envuelve toda la app
```

### 2. **main.jsx** - Envolviendo la App
```javascript
<AuthProvider>  {/* ← Esto hace que TODO tenga acceso al contexto */}
  <App />
</AuthProvider>
```

### 3. **App.jsx** - Rutas Protegidas
```javascript
<ProtectedRoute>  {/* ← Verifica si hay usuario autenticado */}
  <Dashboard />
</ProtectedRoute>
```

---

## 🎯 ¿Cuándo usar `useAuth()`?

### ✅ **SÍ usar en:**

1. **Páginas que necesitan autenticación** (Dashboard, Perfil, etc.)
   ```javascript
   function Dashboard() {
     const { user } = useAuth()
     // Muestra el dashboard solo si hay usuario
   }
   ```

2. **Componentes que muestran info del usuario** (Header, Navbar)
   ```javascript
   function Header() {
     const { user, logout } = useAuth()
     return <p>Hola {user.name}</p>
   }
   ```

3. **Página de Login**
   ```javascript
   function Login() {
     const { login } = useAuth()
     // Usa login() cuando el usuario envía el formulario
   }
   ```

### ❌ **NO usar en:**

- Componentes que no necesitan info de autenticación (botones simples, iconos, etc.)
- Fuera de componentes de React

---

## 📖 Ejemplos Prácticos

### Ejemplo 1: Proteger una Ruta
```javascript
// En App.jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Ejemplo 2: Mostrar info del usuario
```javascript
function Header() {
  const { user } = useAuth()
  
  return (
    <div>
      <p>Bienvenido, {user?.name}</p>
      <p>Rol: {user?.role}</p>
    </div>
  )
}
```

### Ejemplo 3: Hacer Login
```javascript
function Login() {
  const { login } = useAuth()
  
  function handleSubmit(e) {
    e.preventDefault()
    const success = login(username, password)
    if (success) {
      navigate('/dashboard')
    }
  }
}
```

### Ejemplo 4: Hacer Logout
```javascript
function Header() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  function handleLogout() {
    logout()        // Limpia el usuario
    navigate('/login')  // Redirige al login
  }
}
```

### Ejemplo 5: Verificar si el usuario tiene un rol específico
```javascript
function Dashboard() {
  const { user } = useAuth()
  
  // Solo admin puede ver esta sección
  if (user?.role === 'admin') {
    return <AdminPanel />
  }
  
  return <RegularDashboard />
}
```

---

## 🔐 Flujo de Autenticación

```
1. Usuario visita /login
   ↓
2. Ingresa credenciales y hace submit
   ↓
3. Se llama login(username, password)
   ↓
4. Si es válido: setUser({ name, role })
   ↓
5. Navega a /dashboard
   ↓
6. ProtectedRoute verifica: ¿hay user?
   ↓
7. SÍ → Muestra Dashboard
   NO → Redirige a /login
```

---

## 🛡️ ProtectedRoute - ¿Qué hace?

`ProtectedRoute` es un componente que:
- ✅ Verifica si hay un usuario autenticado
- ✅ Si SÍ hay usuario → muestra el contenido (children)
- ✅ Si NO hay usuario → redirige a `/login`

**Ventaja:** No tienes que repetir `if (!user) return <Navigate />` en cada página.

---

## 💡 Tips Importantes

1. **user puede ser `null`**
   ```javascript
   // Siempre verifica antes de usar
   if (user) {
     console.log(user.name)  // ✅ Seguro
   }
   
   // O usa optional chaining
   console.log(user?.name)  // ✅ También seguro
   ```

2. **login() retorna true/false**
   ```javascript
   const success = login(username, password)
   if (!success) {
     // Mostrar error
   }
   ```

3. **logout() solo limpia el estado**
   ```javascript
   logout()  // user se vuelve null
   // Tú decides si redirigir o no
   ```

4. **El estado se pierde al refrescar**
   - Por ahora, al refrescar la página, el usuario debe volver a loguearse
   - En producción, guardarías el token en localStorage

---

## 🎓 Resumen Visual

```
┌─────────────────────────────────────┐
│         main.jsx                    │
│  <AuthProvider>                     │ ← Envuelve TODO
│    <BrowserRouter>                  │
│      <App />                        │
│    </BrowserRouter>                 │
│  </AuthProvider>                    │
└─────────────────────────────────────┘
              │
              │ (provee contexto)
              ▼
┌─────────────────────────────────────┐
│         App.jsx                     │
│  <ProtectedRoute>                   │ ← Protege rutas
│    <Dashboard />                    │
│  </ProtectedRoute>                  │
└─────────────────────────────────────┘
              │
              │ (usa useAuth())
              ▼
┌─────────────────────────────────────┐
│      Dashboard.jsx                  │
│  const { user } = useAuth()         │ ← Accede al contexto
│  // Muestra el dashboard            │
└─────────────────────────────────────┘
```

---

## 🚀 Próximos Pasos

Para mejorar tu sistema de autenticación, podrías:

1. **Guardar sesión en localStorage**
   - Para que no se pierda al refrescar

2. **Agregar más roles**
   - secretaria, admin, supervisor, etc.

3. **Validar rutas por rol**
   - Solo admin puede ver ciertas páginas

4. **Conectar con backend real**
   - Hacer peticiones a una API para validar credenciales

¿Tienes preguntas? ¡Revisa los comentarios en AuthContext.jsx!



