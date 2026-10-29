import { useCallback, useState } from 'react'
import Login from './Login.jsx'
import EquiposTabla from './EquiposTabla.jsx'
import PrestamosTabla from './PrestamosTabla.jsx'
import Avisos from './Avisos.jsx'
import Marca from './Marca.jsx'
import { leerSesion, borrarToken } from './api.js'

export default function App() {
  const [usuario, setUsuario] = useState(() => leerSesion())
  const [vista, setVista] = useState('equipos')
  const [avisos, setAvisos] = useState([])

  const cerrarSesion = useCallback(() => {
    borrarToken()
    setUsuario(null)
    setVista('equipos')
  }, [])

  const avisar = useCallback((tipo, texto) => {
    const id = Date.now() + Math.random()
    setAvisos((a) => [...a, { id, tipo, texto }])
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 4200)
  }, [])

  if (!usuario) return <Login onLogin={setUsuario} />

  const esAdmin = usuario.rol === 'ADMIN'

  return (
    <div className="app">
      <header className="barra-superior">
        <div className="barra-contenido">
          <div className="logo">
            <Marca size={30} />
            <span>TecnoUAM</span>
          </div>
          <div className="sesion">
            <span className="quien">
              {usuario.username}
              {usuario.rol && <small>{usuario.rol}</small>}
            </span>
            <button className="btn btn-borde" onClick={cerrarSesion}>Salir</button>
          </div>
        </div>
      </header>

      <main className="contenido">
        <nav className="pestanas">
          <button className={vista === 'equipos' ? 'activa' : ''} onClick={() => setVista('equipos')}>Equipos</button>
          <button className={vista === 'prestamos' ? 'activa' : ''} onClick={() => setVista('prestamos')}>Préstamos</button>
        </nav>
        {vista === 'equipos' ? (
          <EquiposTabla esAdmin={esAdmin} avisar={avisar} onSesionVencida={cerrarSesion} />
        ) : (
          <PrestamosTabla esAdmin={esAdmin} avisar={avisar} onSesionVencida={cerrarSesion} />
        )}
      </main>
      <Avisos avisos={avisos} />
    </div>
  )
}
