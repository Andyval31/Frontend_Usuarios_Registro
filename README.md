# Frontend - Sistema de Registro de Usuarios

## Descripción

Interfaz web para el sistema de registro de usuarios. Permite crear nuevos usuarios y visualizar la lista de usuarios registrados.

## Tecnologías

**Opción 1**: HTML5 + CSS3 + JavaScript Vanilla  
**Opción 2**: React 18+  
**Opción 3**: Vue.js 3

## Estructura del Proyecto

```
Frontend_Usuarios_Registro/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.js
│   └── index.js
├── public/
│   └── index.html
├── Dockerfile
├── nginx.conf
├── docker-compose.yml
├── package.json
├── .env.example
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── README.md
```

## Dependencias

### React (ejemplo)

json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  }
}
```

## Instalación Local

### 1. Crear red Docker

```bash
docker network create app-network
```

### 2. Clonar y configurar

```bash
git clone https://github.com/Andyval31/Frontend_Usuarios_Registro.git Frontend_Usuarios_Registro
cd Frontend_Usuarios_Registro
cp .env.example .env
nano .env
```

### 3. Configurar .env

```env
# URL del backend
REACT_APP_API_URL=http://localhost:8000/api
PORT=3000
```

### 4. Levantar con Docker

```bash
docker-compose up -d
docker ps | grep frontend
```

### 5. Desarrollo local (sin Docker)

```bash
npm install
npm start
# Acceder a http://localhost:3000
```

## Funcionalidades

### 1. Crear Usuario

- Formulario con validación
- Campos: Nombre, Email, Teléfono
- Mensajes de éxito/error
- Actualización automática de lista

### 2. Listar Usuarios

- Tabla con todos los usuarios
- Ordenados por fecha de creación
- Auto-refresh tras crear usuario

## Ejemplo de Servicio API

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const crearUsuario = async (usuarioData) => {
  const response = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuarioData),
  });
  
  if (!response.ok) throw new Error('Error al crear usuario');
  return response.json();
};

export const obtenerUsuarios = async () => {
  const response = await fetch(`${API_URL}/users/`);
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
};
```

## Comandos Útiles

```bash
# Ver logs
docker logs -f frontend

# Reconstruir
docker-compose up -d --build

# Detener
docker-compose down

# Desarrollo local
npm start
npm test
npm run lint
```

## Despliegue en AWS EKS

### 1. Dockerfile Multi-stage

```dockerfile
# Build
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://users-api-service:8000;
    }
}
```

### 3. Build y Push a ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

docker build -t frontend-service .
docker tag frontend-service:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/frontend-service:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/frontend-service:latest
```

### 4. Manifiestos Kubernetes

Ver carpeta `k8s/`:
- `deployment.yaml` - Deployment del frontend
- `service.yaml` - Service
- `ingress.yaml` - Ingress con HTTPS

### 5. Acceso HTTPS

```
https://tu-dominio.com
```

Configurado con:
- AWS Certificate Manager
- Load Balancer
- Redirección HTTP→HTTPS

## Seguridad

### Headers de Seguridad (nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

### Análisis

```bash
# Dependencias
npm audit

# Linting
npm run lint

# DAST (una vez desplegado)
zap-cli quick-scan https://tu-dominio.com
```

## Troubleshooting

### Error: Network Error al llamar API

```bash
# Verificar backend
docker ps | grep backend

# Verificar URL en .env
cat .env

# Verificar CORS en backend
```

### Frontend no carga cambios

```bash
# Limpiar y reconstruir
docker-compose down
docker-compose up -d --build

# Desarrollo local
rm -rf node_modules package-lock.json
npm install
npm start
```

## Testing

```bash
# Tests unitarios
npm test

# Coverage
npm test -- --coverage

# E2E con Cypress
npm install --save-dev cypress
npx cypress open
```

## Repositorios Relacionados

- Backend: `<URL_REPO_BACKEND>`
- Notificaciones: `<URL_REPO_NOTIFICACIONES>`

---

**UTEC - Administración de Infraestructuras - 2025**
**Integrantes: Matias Ferreira y Andrea Valdez**