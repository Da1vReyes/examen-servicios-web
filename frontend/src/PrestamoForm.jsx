import { useState } from 'react'
import Modal from './Modal.jsx'
import { crearPrestamo, mensajeError } from './api.js'

// Fecha local (toISOString devolveria la de UTC y puede ser el dia siguiente)
const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function PrestamoForm({ equipo, onCerrar, onGuardado }) {
  const [solicitante, setSolicitante] = useState('')
  const [desde, setDesde] = useState(hoy())
  const [hasta, setHasta] = useState('')
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError(null)
    if (hasta < desde) {
      setError('La fecha prevista de devolución no puede ser anterior a la del préstamo.')
      return
    }
    setGuardando(true)
    try {
      await crearPrestamo({
        equipoId: equipo.id,
        nombreSolicitante: solicitante.trim(),
        fechaPrestamo: desde,
        fechaPrevistaDevolucion: hasta,
      })
      onGuardado(`${equipo.nombre} prestado a ${solicitante.trim()}.`)
    } catch (err) {
      setError(mensajeError(err))
      setGuardando(false)
    }
  }

  return (
    <Modal titulo="Registrar préstamo" onCerrar={onCerrar}>
      <p className="modal-sub">{equipo.codigoPatrimonial} · {equipo.nombre}</p>
      <form onSubmit={enviar} className="form">
        <label>
          Nombre del solicitante
          <input value={solicitante} onChange={(e) => setSolicitante(e.target.value)} maxLength={120} required autoFocus />
        </label>
        <div className="fila-2">
          <label>
            Fecha de préstamo
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} required />
          </label>
          <label>
            Devolución prevista
            <input type="date" value={hasta} min={desde} onChange={(e) => setHasta(e.target.value)} required />
          </label>
        </div>
        {error && <p className="alerta" role="alert">{error}</p>}
        <div className="form-acciones">
          <button type="button" className="btn btn-borde" onClick={onCerrar}>Cancelar</button>
          <button className="btn" disabled={guardando}>{guardando ? 'Registrando…' : 'Registrar préstamo'}</button>
        </div>
      </form>
    </Modal>
  )
}
