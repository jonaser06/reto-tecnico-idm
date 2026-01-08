# 🚀 Flujo de Desarrollo (TODO con Docker)

## ✅ Requisitos previos
- Docker y Docker Compose instalados
- Credenciales AWS configuradas

---

## 1️⃣ CONFIGURAR VARIABLES AWS

```bash
# Exporta tus credenciales AWS en la terminal
export AWS_ACCESS_KEY_ID="tu_access_key"
export AWS_SECRET_ACCESS_KEY="tu_secret_key"
export AWS_SESSION_TOKEN="tu_session_token"  # Opcional
```

---

## 2️⃣ DESPLEGAR TABLA DYNAMODB (Solo una vez)

```bash
# Desde la raíz del proyecto
docker-compose --profile deploy up deploy-table

# Esto ejecuta dentro de Docker:
# ✅ yarn install
# ✅ sls deploy --config serverless-table.yml --stage dev
# ✅ Crea tabla "formularios-dev" en AWS
```

**Salida esperada:**
```
✔ Service deployed to stack formularios-microservice-dev
endpoints: (none)
functions: (none)
```

---

## 3️⃣ EJECUTAR LA APLICACIÓN

```bash
# Levantar el servicio principal
docker-compose up

# API disponible en: http://localhost:3000
```

---

## 4️⃣ PROBAR LA API

### Registrar formulario:
```bash
curl -X POST http://localhost:3000/formularios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "tipo_documento": "DNI",
    "numero_documento": "12345678",
    "celular": "+51987654321",
    "correo": "juan@example.com",
    "tratamiento_datos": true,
    "empresa": "ACME Corp"
  }'
```

### Listar formularios:
```bash
curl http://localhost:3000/formularios
```

---

## 5️⃣ ELIMINAR RECURSOS AWS

```bash
# Cuando termines, elimina la tabla DynamoDB
docker-compose run --rm deploy-table sh -c "sls remove --config serverless-table.yml --stage dev"
```

---

## 📋 Resumen de comandos:

| Acción | Comando |
|--------|---------|
| Desplegar tabla | `docker-compose --profile deploy up deploy-table` |
| Iniciar app | `docker-compose up` |
| Ver logs | `docker-compose logs -f lambda` |
| Detener app | `docker-compose down` |
| Eliminar tabla | `docker-compose run --rm deploy-table sh -c "sls remove --config serverless-table.yml --stage dev"` |

---

## ⚠️ Notas importantes:

- **TODO se ejecuta desde Docker** - No necesitas instalar Node/Serverless localmente
- La tabla se crea **UNA VEZ** y persiste datos entre reinicios de la app
- El código se conecta a DynamoDB **real en AWS** (generará costos mínimos)
- Las variables AWS se pasan desde tu terminal al contenedor Docker
