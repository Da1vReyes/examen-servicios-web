import { useEffect, useState } from 'react'
import { listarPrestamos, devolverPrestamo, eliminarPrestamo, borrarToken, mensajeError } from './api.js'
import Confirmar from './Confirmar.jsx'

const fecha = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })

export default function PrestamosTabla({ esAdmin, avisar, onSesionVencida }) {
  const [prestamos, setPrestamos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const [aEliminar, setAEliminar] = useState(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError(null)
    listarPrestamos()
      .then((datos) => activo && setPrestamos([...datos].sort((a, b) => b.id - a.id)))
      .catch((err) => {
        if (!activo) return
        if (err.response?.status === 401) {
          borrarToken()
          onSesionVencida()
          return
        }
        setError('No se pudieron cargar los préstamos.')
      })
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [recarga, onSesionVencida])

  const devolver = async (p) => {
    try {
      await devolverPrestamo(p.id)
      avisar('ok', `${p.equipoNombre} devuelto. Vuelve a estar disponible.`)
      setRecarga((n) => n + 1)
    } catch (err) {
      avisar('error', mensajeError(err))
    }
  }

  const eliminar = async () => {
    const p = aEliminar
    setAEliminar(null)
    try {
      await eliminarPrestamo(p.id)
      avisar('ok', 'Préstamo eliminado.')
      setRecarga((n) => n + 1)
    } catch (err) {
      avisar('error', mensajeError(err))
    }
  }

  return (
    <section className="panel">
      <div className="barra">
        <h2>Préstamos</h2>
        <button className="btn btn-borde" onClick={() => setRecarga((n) => n + 1)} disabled={cargando}>Recargar</button>
      </div>

      {cargando && (
        <div className="esqueleto">{[0, 1, 2].map((i) => <div key={i} className="fila-esq" />)}</div>
      )}
      {error && <p className="alerta" role="alert">{error}</p>}
      {!cargando && !error && prestamos.length === 0 && (
        <div className="vacio"><p>Todavía no hay préstamos registrados.</p></div>
      )}

      {!cargando && !error && prestamos.length > 0 && (
        <div className="tabla-envoltorio">
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Solicitante</th>
                <th>Préstamo</th>
                <th>Devolución prevista</th>
                <th>Estado</th>
                {esAdmin && <th className="der">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p, i) => (
                <tr key={p.id} style={{ animationDelay: `${i * 45}ms` }}>
                  <td className="nombre">{p.equipoNombre}</td>
                  <td>{p.nombreSolicitante}</td>
                  <td>{fecha(p.fechaPrestamo)}</td>
                  <td>{fecha(p.fechaPrevistaDevolucion)}</td>
                  <td>
                    <span className={`estado ${p.estado === 'ACTIVO' ? 'prestado' : 'disponible'}`}>
                      <i />{p.estado === 'ACTIVO' ? 'Activo' : 'Devuelto'}
                    </span>
                  </td>
                  {esAdmin && (
                    <td className="acciones">
                      {p.estado === 'ACTIVO' && <button className="link" onClick={() => devolver(p)}>Registrar devolución</button>}
                      <button className="link peligro" onClick={() => setAEliminar(p)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aEliminar && (
        <Confirmar
          titulo="Eliminar préstamo"
          texto={`¿Eliminar el préstamo de ${aEliminar.equipoNombre} a ${aEliminar.nombreSolicitante}?${aEliminar.estado === 'ACTIVO' ? ' El equipo quedará disponible.' : ''}`}
          textoBoton="Eliminar"
          onCerrar={() => setAEliminar(null)}
          onConfirmar={eliminar}
        />
      )}
    </section>
  )
}
