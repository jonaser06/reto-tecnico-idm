# Testing Guide - 90% Coverage Mínimo

## 🎯 Estrategia de Testing

### Estructura de Tests
```
test/
├── unit/                          # Tests unitarios (aislados)
│   ├── formularios/
│   │   ├── domain/
│   │   │   ├── value-objects/    # Value Objects (100% coverage)
│   │   │   └── entities/         # Aggregates
│   │   ├── application/
│   │   │   ├── commands/         # Command Handlers
│   │   │   └── queries/          # Query Handlers
│   │   └── infrastructure/
│   │       └── persistence/      # Repositories con mocks
│   └── shared/
│       └── types/                 # Result pattern
│
├── integration/                   # Tests de integración
│   ├── api/                       # Endpoints completos
│   └── database/                  # DynamoDB local
│
└── jest.config.js
```

---

## 📋 Cobertura Requerida por Capa

### 1. **Domain Layer** (Target: 100%)
**Por qué**: Lógica de negocio crítica, sin dependencias externas.

**Qué testear**:
- ✅ Value Objects: Todas las validaciones
- ✅ Entities: Creación, invariantes, métodos
- ✅ Domain Errors: Mensajes correctos

**Ejemplo**:
```typescript
// Email.spec.ts
describe("Email Value Object", () => {
  it("debería crear email válido", () => {
    const result = Email.create("test@example.com");
    expect(result.isSuccess()).toBe(true);
  });

  it("debería rechazar email inválido", () => {
    const result = Email.create("invalid");
    expect(result.isSuccess()).toBe(false);
  });
});
```

---

### 2. **Application Layer** (Target: 95%)
**Por qué**: Orquestación de casos de uso.

**Qué testear**:
- ✅ Command Handlers: Flujo completo con mocks
- ✅ Query Handlers: Mapeo de datos
- ✅ DTOs: Transformaciones

**Ejemplo con Mocks**:
```typescript
describe("RegistrarFormularioCommandHandler", () => {
  let handler: RegistrarFormularioCommandHandler;
  let mockRepository: jest.Mocked<IFormularioRepository>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByDocumento: jest.fn(),
    };
    mockLogger = { debug: jest.fn(), info: jest.fn() };
    handler = new RegistrarFormularioCommandHandler(mockRepository, mockLogger);
  });

  it("debería guardar formulario válido", async () => {
    mockRepository.findByDocumento.mockResolvedValue(null);
    
    const result = await handler.execute(validCommand);
    
    expect(result.isSuccess()).toBe(true);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
```

---

### 3. **Infrastructure Layer** (Target: 85%)
**Por qué**: Adapters externos, usar mocks o integración.

**Qué testear**:
- ✅ Mappers: Conversión domain ↔ persistence
- ✅ Repositories: Con DynamoDB local o mocks
- ✅ HTTP Handlers: Con mocks de dependencias
- ⚠️ Excluir: Configuración AWS SDK

**Ejemplo Mapper**:
```typescript
describe("FormularioMapper", () => {
  it("debería mapear Formulario a DynamoDB item", () => {
    const formulario = crearFormularioTest();
    const item = FormularioMapper.toPersistence(formulario);
    
    expect(item.PK).toBe("FORM#...");
    expect(item.email).toBe("test@example.com");
  });
});
```

---

## 🛠️ Comandos de Testing

```bash
# Ejecutar todos los tests
yarn test

# Ejecutar con coverage
yarn test:coverage

# Ejecutar en modo watch
yarn test:watch

# Ejecutar solo tests unitarios
yarn test unit

# Ejecutar tests específicos
yarn test Email.spec.ts

# Ver reporte HTML de coverage
open test/coverage/index.html
```

---

## 📊 Scripts package.json

```json
{
  "scripts": {
    "test": "jest --config=test/jest.config.js",
    "test:coverage": "jest --config=test/jest.config.js --coverage",
    "test:watch": "jest --config=test/jest.config.js --watch",
    "test:unit": "jest --config=test/jest.config.js unit",
    "test:integration": "jest --config=test/jest.config.js integration"
  }
}
```

---

## ✅ Checklist para 90% Coverage

### Value Objects (Prioridad 1)
- [ ] Email.spec.ts
- [ ] Celular.spec.ts
- [ ] TipoDocumento.spec.ts
- [ ] NumeroDocumento.spec.ts
- [ ] FormularioId.spec.ts

### Entities (Prioridad 2)
- [ ] Formulario.spec.ts - Crear con datos válidos/inválidos

### Application Handlers (Prioridad 3)
- [ ] RegistrarFormularioCommandHandler.spec.ts
- [ ] ListarFormulariosQueryHandler.spec.ts

### Shared (Prioridad 4)
- [ ] Result.spec.ts - Pattern de manejo de errores

### Infrastructure (Prioridad 5)
- [ ] FormularioMapper.spec.ts
- [ ] RegisterFormularioInput.spec.ts (class-validator)
- [ ] RegisterFormularioOutput.spec.ts

---

## 🎨 Mejores Prácticas

### 1. **AAA Pattern**
```typescript
it("descripción clara", () => {
  // Arrange - Preparar
  const email = "test@example.com";
  
  // Act - Ejecutar
  const result = Email.create(email);
  
  // Assert - Verificar
  expect(result.isSuccess()).toBe(true);
});
```

### 2. **Un Assert por Test**
```typescript
// ❌ Malo
it("debería validar email", () => {
  expect(result.isSuccess()).toBe(true);
  expect(result.getValue().getValue()).toBe("test@example.com");
  expect(result.getValue().getDomain()).toBe("example.com");
});

// ✅ Bueno
it("debería crear email válido", () => {
  expect(result.isSuccess()).toBe(true);
});

it("debería retornar el valor correcto", () => {
  expect(result.getValue().getValue()).toBe("test@example.com");
});
```

### 3. **Nombres Descriptivos**
```typescript
// ❌ Malo
it("test email", () => { ... });

// ✅ Bueno
it("debería rechazar email sin @ símbolo", () => { ... });
```

### 4. **Mocks Limpios**
```typescript
// Resetear mocks entre tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Verificar llamadas específicas
expect(mockRepository.save).toHaveBeenCalledWith(
  expect.objectContaining({
    id: expect.any(String),
    email: "test@example.com"
  })
);
```

---

## 🚀 Tests de Integración (Opcional)

### Con DynamoDB Local
```typescript
describe("DynamoDBFormularioRepository Integration", () => {
  let repository: DynamoDBFormularioRepository;
  let dynamoClient: DynamoDBDocumentClient;

  beforeAll(async () => {
    // Iniciar DynamoDB local
    dynamoClient = createLocalDynamoDBClient();
    await createTable(dynamoClient);
    repository = new DynamoDBFormularioRepository(dynamoClient);
  });

  it("debería guardar y recuperar formulario", async () => {
    const formulario = crearFormularioTest();
    await repository.save(formulario);
    
    const found = await repository.findByDocumento("CC", "123");
    expect(found).toBeDefined();
  });
});
```

---

## 📈 Monitoreo de Coverage

### Umbral Mínimo (jest.config.js)
```javascript
coverageThreshold: {
  global: {
    branches: 90,    // Todas las ramas if/else
    functions: 90,   // Todas las funciones
    lines: 90,       // Líneas ejecutadas
    statements: 90   // Statements ejecutados
  }
}
```

### CI/CD Validation
```bash
# Fallar build si coverage < 90%
yarn test:coverage --coverageThreshold='{"global":{"branches":90}}'
```

---

## 🎯 Objetivo Final

✅ **Domain**: 100% coverage  
✅ **Application**: 95% coverage  
✅ **Infrastructure**: 85% coverage  
✅ **Total**: **>90% coverage**

**Próximos pasos**:
1. Completar tests de Value Objects
2. Testear Command/Query Handlers con mocks
3. Agregar tests de Mappers
4. Ejecutar `yarn test:coverage` y validar umbral
