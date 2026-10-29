import { useState } from 'react'
import { login, guardarToken } from './api.js'
import Marca from './Marca.jsx'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const datos = await login(username, password)
      guardarToken(datos.token)
      onLogin({ username: datos.username, rol: datos.rol })
    } catch (err) {
      setError(err.response?.status === 401 ? 'Usuario o contraseña incorrectos.' : 'No se pudo conectar con el servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <aside className="login-lado">
        <Marca size={120} animar />
        <h1>TecnoUAM</h1>
        <p>Cada equipo, en su lugar.<br />Y cuando sale, queda registrado.</p>
      </aside>
      <main className="login-form">
        <form onSubmit={enviar}>
          <h2>Iniciar sesión</h2>
          <p className="sub">Centro de Capacitación TecnoUAM</p>
          <label>
            Usuario
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p className="alerta" role="alert">{error}</p>}
          <button className="btn" type="submit" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </main>
    </div>
  )
}
