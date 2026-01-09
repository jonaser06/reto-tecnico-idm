export const TYPES = {
  // Infrastructure
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
