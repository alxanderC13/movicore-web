# 🚍 MoviCore - Sistema de Gestión de Transporte Urbano

Sistema integral de movilidad inteligente para el Distrito Metropolitano de Quito. Plataforma que permite gestionar rutas, vehículos, conductores, viajes, posicionamiento GPS en tiempo real, incidentes, notificaciones y analítica operativa del transporte público.

---

## 👥 Integrantes

| Nombre | Rol |
|---|---|
| **Edison Tanqueño** | Backend (Django REST Framework + PostgreSQL + VPS) |
| **Yandry Llumiquinga** | Aplicación Móvil (Android Studio) |
| **Alexander Calo** | Frontend Web (React + Vite) |

---

## 📋 Descripción del Sistema

**MoviCore** es una API REST robusta desarrollada para resolver una problemática real del transporte público en Quito: la falta de un sistema unificado que permita a las operadoras gestionar su flota, monitorear vehículos en tiempo real, registrar incidentes y obtener métricas operativas.

### Funcionalidades principales

- 🗺️ Gestión de rutas, paradas y coordenadas geográficas
- 🚌 Administración de flota de vehículos
- 👷 Registro y asignación de conductores
- 📍 Posicionamiento GPS en tiempo real
- ⚠️ Reporte y gestión de incidentes
- 📊 Dashboard de analítica con KPIs operativos
- 🔔 Sistema de notificaciones
- 🌐 API pública para consulta ciudadana

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Backend | Django 6.0.6, Python 3.12 |
| API REST | Django REST Framework 3.17 |
| Base de datos | PostgreSQL 16 |
| Autenticación | SimpleJWT (JWT) |
| Documentación | drf-spectacular (Swagger / OpenAPI 3) |
| Filtros y búsqueda | django-filter |
| CORS | django-cors-headers |
| Servidor producción | Gunicorn + Nginx |
| Despliegue | VPS Ubuntu Linux |

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/edtanqueno420/GestionTrasporte.git
cd GestionTrasporte
```

### 2. Crear y activar entorno virtual

```bash
# Linux / Mac
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con los datos de tu PostgreSQL local:

```env
DJANGO_SETTINGS_MODULE=config.settings.development
DJANGO_SECRET_KEY=tu-clave-secreta-aqui
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/quitomove
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 5. Ejecutar migraciones

```bash
python manage.py migrate
```

### 6. Crear grupos de permisos

```bash
python manage.py setup_groups
```

### 7. Crear superusuario

```bash
python manage.py createsuperuser
```

### 8. Cargar datos de demostración

```bash
python manage.py seed_demo
```

### 9. Levantar el servidor de desarrollo

```bash
python manage.py runserver
```

El servidor estará disponible en `http://localhost:8000/`

---

## 🌐 Despliegue en VPS

### Requerimientos del servidor

- Ubuntu 22.04 LTS (recomendado)
- Python 3.12
- PostgreSQL 16
- Nginx
- Gunicorn

### Pasos resumidos

1. **Configurar PostgreSQL** en el VPS y crear la base de datos
2. **Clonar el repositorio** y configurar el `.env` con datos de producción
3. **Instalar dependencias** y aplicar migraciones
4. **Configurar Gunicorn** como servicio systemd
5. **Configurar Nginx** como servidor inverso apuntando a Gunicorn
6. **Configurar HTTPS** (opcional con Let's Encrypt)

---

## 🔌 Uso de la API

### Autenticación JWT

#### Registro de usuario

```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "usuario1",
  "password": "passwordSeguro123"
}
```

#### Inicio de sesión

```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "usuario1",
  "password": "passwordSeguro123"
}
```

**Respuesta:**

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

#### Uso de endpoints protegidos

```http
GET /api/transport/routes/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 📍 Endpoints Principales

### 🔐 Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register/` | Registrar nuevo usuario |
| POST | `/api/auth/login/` | Iniciar sesión y obtener tokens |
| POST | `/api/auth/refresh/` | Renovar access token |
| GET | `/api/auth/me/` | Datos del usuario autenticado |

### 🚌 Transporte (Catálogos)

| Método | Endpoint | Descripción |
|---|---|---|
| GET/POST | `/api/transport/routes/` | Listar/crear rutas |
| GET/POST | `/api/transport/bus-stops/` | Listar/crear paradas |
| GET/POST | `/api/transport/vehicles/` | Listar/crear vehículos |
| GET/POST | `/api/transport/transport-companies/` | Empresas operadoras |

### 🚦 Operaciones

| Método | Endpoint | Descripción |
|---|---|---|
| GET/POST | `/api/operations/drivers/` | Conductores |
| GET/POST | `/api/operations/trips/` | Viajes |
| GET/POST | `/api/operations/gps-positions/` | Posiciones GPS |
| GET/POST | `/api/operations/schedules/` | Horarios |

### ⚠️ Incidentes

| Método | Endpoint | Descripción |
|---|---|---|
| GET/POST | `/api/incidents/incidents/` | Listar/reportar incidentes |
| GET | `/api/incidents/incident-types/` | Tipos de incidente |

### 📊 Analítica

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/analytics/dashboard/` | Indicadores generales (KPIs) |
| GET | `/api/analytics/routes/{id}/report/` | Reporte por ruta |
| GET | `/api/analytics/status/` | Estado del sistema |

### 🔔 Notificaciones

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/notifications/notifications/` | Notificaciones del usuario |
| PATCH | `/api/notifications/notifications/{id}/read/` | Marcar como leída |

### 🌍 API Pública (sin autenticación)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/public/routes/` | Rutas activas |
| GET | `/api/public/routes/{id}/stops/` | Paradas de una ruta |
| GET | `/api/public/routes/{id}/coordinates/` | Polilínea de la ruta |
| GET | `/api/public/bus-stops/` | Todas las paradas |

---

## 📚 Documentación Interactiva

Una vez levantado el servidor, la documentación interactiva está disponible en:

- **Swagger UI:** `http://localhost:8000/api/docs/`
- **OpenAPI Schema:** `http://localhost:8000/api/schema/`
- **Admin Django:** `http://localhost:8000/secure-admin/`

---

## 🧪 Pruebas

Ejecutar todos los tests:

```bash
python manage.py test
```

**Total: 202 tests pasando ✅**

---

## 📦 Colección Postman

La colección con todos los endpoints está disponible en:

(pendiente)

Importar en Postman o Thunder Client para probar todos los endpoints rápidamente.

---

## 🔒 Roles y Permisos

| Grupo | Permisos |
|---|---|
| **Administrator** | CRUD completo en todas las apps (97 permisos) |
| **User** | Lectura general, reporte de incidentes, gestión de notificaciones propias |

---

## 📊 Estado del Proyecto

| Componente | Estado |
|---|---|
| Autenticación JWT | ✅ Completo |
| CRUD de todas las entidades | ✅ Completo |
| Soft delete | ✅ Implementado |
| Documentación Swagger | ✅ Completo |
| Tests unitarios (202) | ✅ Todos pasando |
| Simulación GPS | ✅ Funcional |
| Datos demo precargados | ✅ Comando `seed_demo` |
| Despliegue VPS | 🟡 En proceso |

---

## 📝 Licencia

Proyecto académico desarrollado como parte de la asignatura de Programación.

---

## 🔗 Repositorios del Proyecto

- **Backend (este repo):** [GestionTrasporte](https://github.com/edtanqueno420/GestionTrasporte)
- **Frontend Web:** [movicore-web](https://github.com/alxanderC13/movicore-web)
- **Aplicación Móvil:** *(próximamente)*

---

*Última actualización: Junio 2026*