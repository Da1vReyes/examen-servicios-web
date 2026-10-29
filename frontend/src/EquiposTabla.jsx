import { useEffect, useMemo, useState } from 'react'
import { listarEquipos, eliminarEquipo, borrarToken, mensajeError } from './api.js'
import EquipoForm from './EquipoForm.jsx'
import PrestamoForm from './PrestamoForm.jsx'
import Confirmar from './Confirmar.jsx'

const TIPOS = { PORTATIL: 'Portátil', PROYECTOR: 'Proyector', TABLETA: 'Tableta' }
const FILTROS = [
  { id: 'TODOS', texto: 'Todos' },
  { id: 'DISPONIBLE', texto: 'Disponibles' },
  { id: 'PRESTADO', texto: 'Prestados' },
]

export default function EquiposTabla({ esAdmin, avisar, onSesionVencida }) {
  const [equipos, setEquipos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const [filtro, setFiltro] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')
  const [dialogo, setDialogo] = useState(null) // { tipo: 'nuevo'|'editar'|'prestar'|'eliminar', equipo }

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError(null)
    listarEquipos()
      .then((datos) => activo && setEquipos(datos))
      .catch((err) => {
        if (!activo) return
        if (err.response?.status === 401) {
          borrarToken()
          onSesionVencida()
          return
        }
        setError('No se pudieron cargar los equipos. Verifica que el backend esté en ejecución.')
      })
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [recarga, onSesionVencida])

  const total = equipos.length
  const disponibles = equipos.filter((e) => e.estado === 'DISPONIBLE').length
  const prestados = total - disponibles

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return equipos.filter(
      (e) =>
        (filtro === 'TODOS' || e.estado === filtro) &&
        (!q || e.nombre.toLowerCase().includes(q) || e.codigoPatrimonial.toLowerCase().includes(q)),
    )
  }, [equipos, filtro, busqueda])

  const cerrar = () => setDialogo(null)
  const guardado = (texto) => {
    cerrar()
    avisar('ok', texto)
    setRecarga((n) => n + 1)
  }

  const eliminar = async () => {
    const { equipo } = dialogo
    cerrar()
    try {
      await eliminarEquipo(equipo.id)
      avisar('ok', `Equipo ${equipo.codigoPatrimonial} eliminado.`)
      setRecarga((n) => n + 1)
    } catch (err) {
      avisar('error', mensajeError(err))
    }
  }

  return (
    <>
      <section className="resumen">
        <Stat etiqueta="Equipos" valor={total} clase="" retraso={0} />
        <Stat etiqueta="Disponibles" valor={disponibles} clase="verde" retraso={80} />
        <Stat etiqueta="Prestados" valor={prestados} clase="ambar" retraso={160} />
      </section>

      <section className="panel">
        <div className="barra">
          <h2>Inventario</h2>
          <div className="barra-acciones">
            <button className="btn btn-borde" onClick={() => setRecarga((n) => n + 1)} disabled={cargando}>Recargar</button>
            {esAdmin && <button className="btn" onClick={() => setDialogo({ tipo: 'nuevo' })}>Nuevo equipo</button>}
          </div>
        </div>

        <div className="herramientas">
          <input className="buscar" placeholder="Buscar por nombre o código…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <div className="chips">
            {FILTROS.map((f) => (
              <button key={f.id} className={`chip ${filtro === f.id ? 'activo' : ''}`} onClick={() => setFiltro(f.id)}>
                {f.texto}
              </button>
            ))}
          </div>
        </div>

        {cargando && (
          <div className="esqueleto" aria-label="Cargando equipos">
            {[0, 1, 2, 3].map((i) => <div key={i} className="fila-esq" />)}
          </div>
        )}
        {error && <p className="alerta" role="alert">{error}</p>}
        {!cargando && !error && visibles.length === 0 && (
          <div className="vacio">
            <p>{total === 0 ? 'No hay equipos registrados.' : 'Ningún equipo coincide con la búsqueda.'}</p>
          </div>
        )}

        {!cargando && !error && visibles.length > 0 && (
          <div className="tabla-envoltorio">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  {esAdmin && <th className="der">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {visibles.map((e, i) => (
                  <tr key={e.id} style={{ animationDelay: `${i * 55}ms` }}>
                    <td className="codigo">{e.codigoPatrimonial}</td>
                    <td className="nombre">{e.nombre}</td>
                    <td><span className="tipo">{TIPOS[e.tipo] ?? e.tipo}</span></td>
                    <td><span className={`estado ${e.estado.toLowerCase()}`}><i />{e.estado === 'DISPONIBLE' ? 'Disponible' : 'Prestado'}</span></td>
                    {esAdmin && (
                      <td className="acciones">
                        {e.estado === 'DISPONIBLE' && (
                          <button className="link" onClick={() => setDialogo({ tipo: 'prestar', equipo: e })}>Prestar</button>
                        )}
                        <button className="link" onClick={() => setDialogo({ tipo: 'editar', equipo: e })}>Editar</button>
                        <button className="link peligro" onClick={() => setDialogo({ tipo: 'eliminar', equipo: e })}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {dialogo?.tipo === 'nuevo' && <EquipoForm onCerrar={cerrar} onGuardado={guardado} />}
      {dialogo?.tipo === 'editar' && <EquipoForm equipo={dialogo.equipo} onCerrar={cerrar} onGuardado={guardado} />}
      {dialogo?.tipo === 'prestar' && <PrestamoForm equipo={dialogo.equipo} onCerrar={cerrar} onGuardado={guardado} />}
      {dialogo?.tipo === 'eliminar' && (
        <Confirmar
          titulo="Eliminar equipo"
          texto={`¿Eliminar ${dialogo.equipo.codigoPatrimonial} · ${dialogo.equipo.nombre}? Se borra también su historial de préstamos.`}
          textoBoton="Eliminar"
          onCerrar={cerrar}
          onConfirmar={eliminar}
        />
      )}
    </>
  )
}

function Stat({ etiqueta, valor, clase, retraso }) {
  return (
    <div className={`stat ${clase}`} style={{ animationDelay: `${retraso}ms` }}>
      <span className="stat-valor">{valor}</span>
      <span className="stat-etiqueta">{etiqueta}</span>
    </div>
  )
}
