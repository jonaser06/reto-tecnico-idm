import "reflect-metadata";
import { Container } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { TYPES } from "./types";
import { ILogger } from "../logger/ILogger";
import { PowertoolsLogger } from "../logger/PowertoolsLogger";
import { IFormularioRepository } from "../../../formularios/domain/repositories/IFormularioRepository";
import { DynamoDBFormularioRepository } from "../../../formularios/infrastructure/persistence/DynamoDBFormularioRepository";
import { RegistrarFormularioCommandHandler } from "../../../formularios/application/commands/RegistrarFormulario/RegistrarFormularioCommandHandler";
import { ListarFormulariosQueryHandler } from "../../../formularios/application/queries/ListarFormularios/ListarFormulariosQueryHandler";
import { RegisterFormularioHandler } from "../../../formularios/infrastructure/http/RegisterFormularioHandler";
import { ListFormulariosHandler } from "../../../formularios/infrastructure/http/ListFormulariosHandler";

let cachedContainer: Container | null = null;

export function buildContainer(): Container {
  if (cachedContainer) {
    return cachedContainer;
  }

  const container = new Container();

  // Logger
  container.bind<ILogger>(TYPES.Logger).to(PowertoolsLogger).inSingletonScope();

  // DynamoDB Client (Singleton para reutilizar conexiones)
  container
    .bind<DynamoDBDocumentClient>(TYPES.DynamoDBClient)
    .toDynamicValue(() => {
      const client = new DynamoDBClient({
        region: process.env.AWS_REGION || "us-east-1",
      });
      return DynamoDBDocumentClient.from(client);
    })
    .inSingletonScope();

  // Repositories
  container.bind<IFormularioRepository>(TYPES.FormularioRepository).to(DynamoDBFormularioRepository).inSingletonScope();

  // Application Handlers
  container
    .bind<RegistrarFormularioCommandHandler>(TYPES.RegistrarFormularioCommandHandler)
    .to(RegistrarFormularioCommandHandler);
  container.bind<ListarFormulariosQueryHandler>(TYPES.ListarFormulariosQueryHandler).to(ListarFormulariosQueryHandler);

  // Infrastructure HTTP Handlers
  container.bind<RegisterFormularioHandler>(TYPES.RegisterFormularioHandler).to(RegisterFormularioHandler);
  container.bind<ListFormulariosHandler>(TYPES.ListFormulariosHandler).to(ListFormulariosHandler);

  cachedContainer = container;
  return container;
}

export function resetContainer(): void {
  cachedContainer = null;
}
