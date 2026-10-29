# TecnoUAM - Sistema de préstamo de equipos tecnológicos

Examen práctico integrador (Servicios Web, UAM). API REST con Spring Boot, persistencia en PostgreSQL,
autenticación con Spring Security + JWT e interfaz React.

- `src/` backend Spring Boot (Java 17+, Maven)
- `frontend/` interfaz React (Vite + Axios)
- `postman/` colección de pruebas
- `docker-compose.yml` base de datos PostgreSQL

## Requisitos

Java 17 o superior, Node.js 18 o superior, Docker.

## Ejecución

### 1. Variables de entorno

Copiar `.env.example` a `.env` (el archivo `.env` no se sube al repositorio) y completar los valores:

| Variable | Descripción |
|---|---|
| `DB_URL` | URL JDBC, por ejemplo `jdbc:postgresql://localhost:5432/tecnouam` |
| `DB_USER` / `DB_PASSWORD` | Credenciales de la base (deben coincidir con `docker-compose.yml`) |
| `JWT_SECRET_KEY` | Clave de firma del JWT en base64, mínimo 256 bits. Generar con `openssl rand -base64 32` |
| `APP_ADMIN_PASSWORD` | Contraseña de la cuenta de prueba `admin` |
| `APP_USER_PASSWORD` | Contraseña de la cuenta de prueba `user` |
| `APP_CORS_ORIGINS` | (opcional) Orígenes permitidos, por defecto `http://localhost:5173` |

### 2. Base de datos

```bash
docker compose up -d
```

Las migraciones de Flyway (`src/main/resources/db/migration`) crean las tablas y cargan 4 equipos de ejemplo
al iniciar el backend. Las cuentas de prueba se crean en el arranque con las contraseñas del `.env`.

### 3. Backend

```bash
./mvnw spring-boot:run
```

Queda en `http://localhost:8080`.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Queda en `http://localhost:5173`. Si el backend usa otra URL, copiar `frontend/.env.example` a `frontend/.env`
y cambiar `VITE_API_URL`.

## Cuentas de prueba

| Usuario | Rol | Contraseña |
|---|---|---|
| `admin` | ADMIN | valor de `APP_ADMIN_PASSWORD` |
| `user` | USER | valor de `APP_USER_PASSWORD` |

## Endpoints

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | público | Devuelve el JWT |
| GET | `/api/equipos` | USER, ADMIN | Listar equipos |
| GET | `/api/equipos/{id}` | USER, ADMIN | Consultar un equipo |
| POST | `/api/equipos` | ADMIN | Registrar un equipo (201) |
| PUT | `/api/equipos/{id}` | ADMIN | Modificar un equipo |
| DELETE | `/api/equipos/{id}` | ADMIN | Eliminar (204); 409 si tiene préstamos activos |
| GET | `/api/prestamos` | USER, ADMIN | Listar préstamos |
| GET | `/api/prestamos/{id}` | USER, ADMIN | Consultar un préstamo |
| POST | `/api/prestamos` | ADMIN | Registrar préstamo; el equipo pasa a PRESTADO |
| PUT | `/api/prestamos/{id}` | ADMIN | Modificar solicitante y fecha prevista |
| PUT | `/api/prestamos/{id}/devolver` | ADMIN | Registrar devolución; el equipo vuelve a DISPONIBLE |
| DELETE | `/api/prestamos/{id}` | ADMIN | Eliminar un préstamo |

Las peticiones protegidas llevan la cabecera `Authorization: Bearer <token>`.

Códigos HTTP: 201 al crear, 200 al consultar o actualizar, 204 al eliminar, 400 datos inválidos,
401 sin token o credenciales incorrectas, 403 rol insuficiente, 404 recurso inexistente, 409 conflicto de negocio.

Ejemplo de cuerpo para registrar un préstamo:

```json
{ "equipoId": 1, "nombreSolicitante": "Instructor Uno", "fechaPrevistaDevolucion": "2026-12-01" }
```

`fechaPrestamo` es opcional (por defecto, hoy). La fecha prevista no puede ser anterior a la del préstamo.

## Pruebas con Postman

Importar `postman/TecnoUAM.postman_collection.json`, definir las variables de la colección
`adminPassword` y `userPassword` (las del `.env`) y ejecutar la colección completa con el Collection Runner.
Cubre: alta, consulta, actualización, préstamo, préstamo repetido (409), devolución, eliminación permitida y
bloqueada, y los casos 401 y 403. Cada solicitud incluye aserciones.

Por línea de comandos (opcional):

```bash
npx newman run postman/TecnoUAM.postman_collection.json \
  --env-var adminPassword=... --env-var userPassword=...
```

## Reglas de negocio

- Código patrimonial único por equipo.
- No se registra un préstamo para un equipo que ya está PRESTADO.
- Registrar un préstamo pone el equipo en PRESTADO; la devolución lo regresa a DISPONIBLE.
- No se elimina un equipo con préstamos activos; los préstamos devueltos (historial) se eliminan junto con el equipo.
- USER solo consulta; ADMIN crea, actualiza y elimina equipos y registra préstamos y devoluciones.
