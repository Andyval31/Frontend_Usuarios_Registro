# Frontend - Sistema de Registro de Usuarios

## Descripción

Interfaz web que permite a los usuarios registrarse en el sistema ingresando su nombre, email y teléfono. Muestra la lista de usuarios registrados consumiendo la API REST del backend.

**Ejercicio**: 1 - Desarrollo Local  
**Tecnologías**: HTML/CSS/JavaScript o React

---

## Estructura del Proyecto

### Opción React:
```
Frontend_Usuarios_Registro/
├── src/
│   ├── components/
│   │   ├── FormularioUsuario.js
│   │   └── ListaUsuarios.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── public/
│   └── index.html
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

### Opción HTML Vanilla:
```
Frontend_Usuarios_Registro/
├── index.html
├── style.css
├── app.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Dependencias

### React (si aplica)

```json
{
  "name": "frontend-usuarios",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
```

### HTML Vanilla

```json
{
  "name": "frontend-usuarios",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## Configuración e Instalación

### Paso 1: Prerrequisitos

- ✅ Docker y Docker Compose instalados
- ✅ Git instalado
- ✅ Puerto 3000 disponible
- ✅ Backend corriendo en http://localhost:8000

### Paso 2: Asegurar Red de Docker

El frontend debe estar en la misma red que el backend:

```bash
# Verificar que existe la red
docker network ls | grep app-network

# Si no existe, crearla:
docker network create app-network
```

### Paso 3: Clonar el Repositorio

```bash
git clone <URL_DE_ESTE_REPOSITORIO>
cd Frontend_Usuarios_Registro
```

### Paso 4: Configurar Variables de Entorno

Crear archivo `.env` en la raíz:

```bash
cp .env.example .env
nano .env
```

**Contenido del .env:**

```env
# URL del backend
REACT_APP_API_URL=http://localhost:8000/api
# o para HTML vanilla:
API_URL=http://localhost:8000/api

# Puerto del frontend
PORT=3000
```

### Paso 5: Levantar el Frontend

#### Opción A: Con Docker (Recomendado)

```bash
# Levantar frontend
docker-compose up -d

# Verificar que está corriendo
docker ps | grep frontend

# Ver logs
docker logs -f frontend
```

#### Opción B: Desarrollo Local (sin Docker)

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Se abrirá automáticamente en http://localhost:3000
```

### Paso 6: Verificar Funcionamiento

Abrir navegador en: **http://localhost:3000**

Deberías ver:
- ✅ Formulario para crear usuarios
- ✅ Lista de usuarios registrados (vacía al inicio)

---

## Funcionalidades

### 1. Formulario de Registro

**Campos:**
- **Nombre**: Texto (obligatorio)
- **Email**: Email válido (obligatorio)
- **Teléfono**: Texto (obligatorio)

**Validaciones:**
- Todos los campos son obligatorios
- El email debe tener formato válido
- Mensajes de error claros si falta información

**Comportamiento:**
- Al enviar, hace POST a `/api/users/`
- Muestra mensaje de éxito
- Limpia el formulario
- Recarga automáticamente la lista de usuarios

### 2. Lista de Usuarios

**Información mostrada:**
- ID
- Nombre
- Email
- Teléfono
- Fecha de creación (formato legible)

**Comportamiento:**
- Se carga automáticamente al abrir la página
- Se actualiza después de crear un usuario
- Si no hay usuarios, muestra mensaje informativo

---

## Ejemplo de Código

### Servicio API (api.js)

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/users/`);
    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Crear nuevo usuario
export const crearUsuario = async (usuarioData) => {
  try {
    const response = await fetch(`${API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarioData),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Componente de Formulario (ejemplo React)

```javascript
import { useState } from 'react';
import { crearUsuario } from '../services/api';

function FormularioUsuario({ onUsuarioCreado }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await crearUsuario(formData);
      alert('Usuario creado exitosamente');
      setFormData({ nombre: '', email: '', telefono: '' });
      onUsuarioCreado(); // Recargar lista
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input
        type="text"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
        required
      />
      <button type="submit">Registrar Usuario</button>
    </form>
  );
}
```

---

## Comandos Útiles

### Ver Logs

```bash
# Logs en tiempo real
docker logs -f frontend

# Últimas 50 líneas
docker logs --tail=50 frontend
```

### Acceder al Contenedor

```bash
# Shell del contenedor
docker exec -it frontend /bin/sh

# Ver archivos
docker exec -it frontend ls -la
```

### Reiniciar Servicio

```bash
# Reiniciar frontend
docker restart frontend

# Reiniciar con reconstrucción (tras cambios de código)
docker-compose down
docker-compose up -d --build
```

### Detener Servicio

```bash
# Detener
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con hot-reload)
npm start

# Build para producción
npm run build

# Linting
npm run lint

# Tests
npm test
```

---

## Troubleshooting (Solución de Problemas)

### Problema 1: Error "Network Error" al crear usuario

**Síntoma:** Al enviar el formulario aparece error de red

**Solución:**

1. **Verificar que el backend está corriendo:**
```bash
docker ps | grep backend
curl http://localhost:8000/api/users/
```

2. **Verificar la URL de la API en .env:**
```bash
cat .env
# Debe ser: REACT_APP_API_URL=http://localhost:8000/api
```

3. **Verificar CORS en el backend:**
   - El backend debe permitir peticiones desde `http://localhost:3000`
   - Ver archivo `.env` del backend: `CORS_ALLOWED_ORIGINS=http://localhost:3000`

4. **Verificar la red Docker:**
```bash
docker network inspect app-network
# Ambos contenedores deben aparecer
```

### Problema 2: Puerto 3000 ya está en uso

**Síntoma:**
```
Error: bind: address already in use
```

**Solución:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# O cambiar puerto en .env:
PORT=3001
```

### Problema 3: Frontend no carga después de cambios

**Síntoma:** Los cambios en el código no se reflejan

**Solución:**

```bash
# Con Docker
docker-compose down
docker-compose up -d --build

# Desarrollo local
# Ctrl+C para detener npm start
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problema 4: Lista de usuarios no se actualiza

**Síntoma:** Se crea el usuario pero no aparece en la lista

**Solución:**

1. **Verificar en la API directamente:**
```bash
curl http://localhost:8000/api/users/
```

2. **Revisar la consola del navegador** (F12) en busca de errores

3. **Verificar que se llame a la función de recarga** después de crear el usuario

### Problema 5: Estilos CSS no se aplican

**Síntoma:** La página se ve sin estilos

**Solución:**

1. **Verificar que los archivos CSS estén importados:**
```javascript
import './App.css';
```

2. **Limpiar caché del navegador:**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

3. **Reconstruir el proyecto:**
```bash
npm run build
```

---

## Capturas de Pantalla para Entrega

### Captura 1: Formulario Vacío
- Mostrar el formulario completo con todos los campos
- Archivo sugerido: `capturas/01-formulario-vacio.png`

### Captura 2: Formulario Completado
- Formulario con datos de ejemplo listos para enviar
- Archivo sugerido: `capturas/02-formulario-completado.png`

### Captura 3: Mensaje de Éxito
- Mensaje de confirmación después de crear usuario
- Archivo sugerido: `capturas/03-mensaje-exito.png`

### Captura 4: Lista de Usuarios
- Lista mostrando al menos 3 usuarios creados
- Archivo sugerido: `capturas/04-lista-usuarios.png`

---

## Pruebas Manuales

### Test 1: Crear Usuario

1. Abrir http://localhost:3000
2. Completar formulario:
   - Nombre: Juan Pérez
   - Email: juan@ejemplo.com
   - Teléfono: +598 99 123 456
3. Click en "Registrar" o "Crear Usuario"
4. ✅ Verificar mensaje de éxito
5. ✅ Verificar que el usuario aparece en la lista
6. ✅ Verificar que el formulario se limpió

### Test 2: Validación de Email

1. Intentar crear usuario con email inválido: "juan@ejemplo"
2. ✅ Debe mostrar error de validación
3. Corregir a email válido: "juan@ejemplo.com"
4. ✅ Debe permitir crear el usuario

### Test 3: Campos Obligatorios

1. Intentar enviar formulario con campos vacíos
2. ✅ Debe mostrar errores de validación
3. ✅ No debe hacer petición a la API

### Test 4: Lista Vacía

1. Abrir el frontend cuando no hay usuarios en la BD
2. ✅ Debe mostrar mensaje "No hay usuarios registrados"

---

## Estructura de docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    container_name: frontend
    ports:
      - "3000:80"
    env_file:
      - .env
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    external: true
```

---

## Próximos Pasos (Ejercicio 2-3)

En los ejercicios siguientes:
- El frontend se desplegará en **AWS EKS**
- Se expondrá públicamente vía **HTTPS** con certificado SSL
- Se configurará un **Load Balancer**
- Se usará un **dominio propio**

---

## Repositorios Relacionados

- **Backend**: `<URL_REPOSITORIO_BACKEND>`
- **Notificaciones**: `<URL_REPOSITORIO_NOTIFICACIONES>` (Ejercicio 2)

---

## Contacto

- **Equipo**: [Nombres de integrantes]
- **Email**: [email_del_equipo@ejemplo.com]

---

**Proyecto**: Administración de Infraestructuras  
**Institución**: ITSJ  
**Fecha**: Noviembre 2025  
**Ejercicio**: 1 - Desarrollo Local