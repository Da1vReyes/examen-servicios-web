import { useState } from 'react'
import Modal from './Modal.jsx'
import { crearEquipo, actualizarEquipo, mensajeError } from './api.js'

const TIPOS = [
  ['PORTATIL', 'Portátil'],
  ['PROYECTOR', 'Proyector'],
  ['TABLETA', 'Tableta'],
]

export default function EquipoForm({ equipo, onCerrar, onGuardado }) {
  const [codigo, setCodigo] = useState(equipo?.codigoPatrimonial ?? '')
  const [nombre, setNombre] = useState(equipo?.nombre ?? '')
  const [tipo, setTipo] = useState(equipo?.tipo ?? 'PORTATIL')
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    const datos = { codigoPatrimonial: codigo.trim(), nombre: nombre.trim(), tipo }
    try {
      if (equipo) await actualizarEquipo(equipo.id, datos)
      else await crearEquipo(datos)
      onGuardado(equipo ? 'Equipo actualizado.' : 'Equipo registrado.')
    } catch (err) {
      setError(err.response?.status === 409 ? 'Ya existe un equipo con ese código patrimonial.' : mensajeError(err))
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={equipo ? 'Editar equipo' : 'Nuevo equipo'} onCerrar={onCerrar}>
      <form onSubmit={enviar} className="form">
        <label>
          Código patrimonial
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} maxLength={50} required autoFocus />
        </label>
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} required />
        </label>
        <label>
          Tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
          </select>
        </label>
        {error && <p className="alerta" role="alert">{error}</p>}
        <div className="form-acciones">
          <button type="button" className="btn btn-borde" onClick={onCerrar}>Cancelar</button>
          <button className="btn" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </Modal>
  )
}
