import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

const CLAVE_TOKEN = 'tecnouam_token'

export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token)
export const leerToken = () => localStorage.getItem(CLAVE_TOKEN)
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN)

// Recupera usuario y rol del payload del JWT (sin verificar firma: solo para mostrar la interfaz).
export function leerSesion() {
  const token = leerToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp * 1000 < Date.now()) return null
    return { username: payload.sub, rol: payload.rol }
  } catch {
    return null
  }
}

// Adjunta el JWT guardado en cada peticion.
api.interceptors.request.use((config) => {
  const token = leerToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const mensajeError = (err) =>
  err.response?.data?.message ??
  (err.response?.status === 403 ? 'No tienes permiso para esta acción.' : 'No se pudo completar la operación.')

export const login = (username, password) =>
  api.post('/api/auth/login', { username, password }).then((r) => r.data)

export const listarEquipos = () => api.get('/api/equipos').then((r) => r.data)
export const crearEquipo = (datos) => api.post('/api/equipos', datos).then((r) => r.data)
export const actualizarEquipo = (id, datos) => api.put(`/api/equipos/${id}`, datos).then((r) => r.data)
export const eliminarEquipo = (id) => api.delete(`/api/equipos/${id}`)

export const listarPrestamos = () => api.get('/api/prestamos').then((r) => r.data)
export const crearPrestamo = (datos) => api.post('/api/prestamos', datos).then((r) => r.data)
export const devolverPrestamo = (id) => api.put(`/api/prestamos/${id}/devolver`).then((r) => r.data)
export const eliminarPrestamo = (id) => api.delete(`/api/prestamos/${id}`)

export default api
