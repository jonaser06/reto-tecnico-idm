export const TYPES = {
  // Infrastructure
  Logger: Symbol.for("ILogger"),
  FormularioRepository: Symbol.for("IFormularioRepository"),
  DynamoDBClient: Symbol.for("DynamoDBClient"),

  // Application - Commands
  RegistrarFormularioCommandHandler: Symbol.for("RegistrarFormularioCommandHandler"),

  // Application - Queries
  ListarFormulariosQueryHandler: Symbol.for("ListarFormulariosQueryHandler"),

  // Infrastructure - Handlers
  RegisterFormularioHandler: Symbol.for("RegisterFormularioHandler"),
  ListFormulariosHandler: Symbol.for("ListFormulariosHandler"),
};
