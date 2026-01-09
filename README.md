# Microservicio de Registro de Formularios

Microservicio para registrar y consultar formularios con campos dinámicos. Desarrollado con Node.js, TypeScript y DynamoDB, siguiendo arquitectura hexagonal y Domain-Driven Design.

## Que hace este proyecto

- Recibe formularios via API REST con campos obligatorios y opcionales
- Valida los datos antes de guardarlos
- Almacena en DynamoDB (base de datos NoSQL)
- Permite consultar todos los formularios registrados
- Acepta campos adicionales sin modificar el codigo

## Campos del formulario

| Campo | Tipo | Requerido | Descripcion |
|-------|------|-----------|-------------|
| nombre | string | Si | Nombre de la persona |
| apellido | string | Si | Apellido de la persona |
| tipo_documento | enum | Si | DNI, CE o PASAPORTE |
| numero_documento | string | Si | Numero del documento |
| celular | string | Si | Telefono (9-15 digitos) |
| correo | string | Si | Email valido |
| tratamiento_datos | boolean | Si | Debe ser true |
| *campos adicionales* | any | No | Cualquier campo extra |

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
│                    POST/GET /formularios                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Lambda Functions                            │
│  ┌─────────────────────┐    ┌─────────────────────────────┐     │
│  │ RegisterFormulario  │    │    ListFormularios          │     │
│  └─────────────────────┘    └─────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Aplicacion                                │
│  ┌─────────────────────┐    ┌─────────────────────────────┐     │
│  │  CommandHandler     │    │      QueryHandler           │     │
│  │  (registrar)        │    │      (listar)               │     │
│  └─────────────────────┘    └─────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Dominio                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────┐     │
│  │  Formulario  │  │  Value Objects                       │     │
│  │  (entidad)   │  │  Email, Celular, TipoDocumento...    │     │
│  └──────────────┘  └──────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Infraestructura                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              DynamoDB Repository                         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DynamoDB                                 │
│                    tabla: formularios-dev                        │
└─────────────────────────────────────────────────────────────────┘
```

## Estructura del proyecto

```
app/
├── src/
│   ├── formularios/
│   │   ├── domain/           # Entidades y reglas de negocio
│   │   ├── application/      # Casos de uso (commands, queries)
│   │   └── infrastructure/   # Handlers HTTP, repositorio DynamoDB
│   └── shared/               # Contenedor DI, errores comunes
├── test/                     # Tests unitarios
├── docs/                     # Documentacion OpenAPI
└── config/                   # Configuracion serverless
```

## Requisitos

- Docker y Docker Compose
- Credenciales de AWS configuradas

## Como levantar el proyecto

### 1. Configurar credenciales AWS

```bash
export AWS_ACCESS_KEY_ID="tu_access_key"
export AWS_SECRET_ACCESS_KEY="tu_secret_key"
export AWS_SESSION_TOKEN="tu_session_token"  # si usas credenciales temporales
```

### 2. Crear la tabla en DynamoDB (solo la primera vez)

```bash
make deploy-table
```

### 3. Levantar el servidor local

```bash
make start
```

La API queda disponible en `http://localhost:3000`

## Comandos disponibles

| Comando | Que hace |
|---------|----------|
| `make start` | Levanta el servidor en localhost:3000 |
| `make deploy-table` | Crea la tabla DynamoDB en AWS |
| `make test` | Ejecuta los tests con cobertura |
| `make docs` | Genera y abre la documentacion OpenAPI |
| `make deploy` | Despliega las lambdas a AWS |
| `make remove` | Elimina las lambdas de AWS |
| `make remove-table` | Elimina la tabla DynamoDB |

## Probar la API

### Registrar un formulario

```bash
curl -X POST http://localhost:3000/formularios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Perez",
    "tipo_documento": "DNI",
    "numero_documento": "12345678",
    "celular": "987654321",
    "correo": "juan@example.com",
    "tratamiento_datos": true
  }'
```

### Registrar con campos adicionales

```bash
curl -X POST http://localhost:3000/formularios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Maria",
    "apellido": "Garcia",
    "tipo_documento": "CE",
    "numero_documento": "CE123456",
    "celular": "+51987654321",
    "correo": "maria@example.com",
    "tratamiento_datos": true,
    "empresa": "Tech Solutions",
    "cargo": "Desarrolladora",
    "ciudad": "Lima"
  }'
```

### Listar formularios

```bash
curl http://localhost:3000/formularios
```

## Tests

El proyecto incluye tests unitarios para:

- Value Objects (Email, Celular, TipoDocumento, NumeroDocumento)
- Command Handlers (registro de formularios)
- Validaciones de campos obligatorios y formatos

Para ejecutar los tests:

```bash
make test
```

## Tecnologias

- Node.js 20 con TypeScript
- Serverless Framework
- AWS Lambda + API Gateway
- DynamoDB
- Inversify (inyeccion de dependencias)
- Middy (middleware para Lambda)
- Jest (testing)
- class-validator (validaciones)

## Documentacion API

La especificacion OpenAPI esta en `app/docs/openapi/`. Para verla:

```bash
make docs
```

Esto genera un HTML con la documentacion interactiva.
