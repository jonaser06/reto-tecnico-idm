Reto Técnico: Microservicio de Registro Dinámico de Formularios

Objetivo
Desarrollar un microservicio que reciba datos de un formulario vía API REST,
los valide y los almacene en una base de datos No Relacional. El diseño debe
seguir la estrategia API First, utilizando una especificación OpenAPI como
punto de partida.

Requisitos Funcionales
1. Recepción de datos: El microservicio debe exponer un endpoint que
reciba los datos de un formulario en formato JSON.
2. Campos obligatorios:
    o nombre (string)
    o apellido (string)
    o tipo_documento (enum: DNI, CE, PASAPORTE)
    o numero_documento (string)
    o celular (string)
    o correo (string, formato email)
    o tratamiento_datos (boolean, debe ser true)
3. Flexibilidad: El microservicio debe permitir recibir campos adicionales
sin romper la estructura ni la validación de los campos obligatorios.
4. Persistencia: Almacenar los datos en una base de datos NoSQL (por
ejemplo, MongoDB), incluyendo los campos adicionales.
5. Respuesta: Retornar una respuesta clara indicando éxito o error, con
detalles si hay errores de validación.

Requisitos Técnicos
 Lenguaje: Java, Node.js
 Base de datos: MongoDB, DynamoDB, Firebase o similar.
 API First:
    o Crear una especificación OpenAPI (swagger.yaml o swagger.json) antes de implementar.
 Contenedorización: Dockerizar el microservicio.
 Validación: Validar los datos enviados.
 Pruebas: Implementar pruebas unitarias para validación y persistencia.

Entregables
1. Archivo OpenAPI con la definición de la API.
2. Código fuente del microservicio.
3. Archivo Dockerfile y docker-compose.yml (si aplica).

Bonus (Opcional)
 Endpoint para listar formularios registrados.
 Autenticación básica (API Key o JWT).
 Despliegue en una plataforma cloud (AWS, GCP, Azure, Heroku).
 Implementación de OpenApi Generator.