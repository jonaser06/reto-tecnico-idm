import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../shared/infrastructure/container/types";
import { RegisterFormularioInput } from "./inputs/RegisterFormularioInput";
import { RegisterFormularioOutput } from "./outputs/RegisterFormularioOutput";
import { RegistrarFormularioCommandHandler } from "../../application/commands/RegistrarFormulario/RegistrarFormularioCommandHandler";
import { RegistrarFormularioCommand } from "../../application/commands/RegistrarFormulario/RegistrarFormularioCommand";
import { buildContainer } from "../../../shared/infrastructure/container/container";
import { validatorMiddleware } from "../../../shared/infrastructure/middleware/validator.middleware";

const CAMPOS_OBLIGATORIOS = [
  "nombres",
  "apellidos",
  "tipoDocumento",
  "numeroDocumento",
  "email",
  "celular",
  "tratamientoDatos",
];

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

@injectable()
export class RegisterFormularioHandler {
  constructor(
    @inject(TYPES.RegistrarFormularioCommandHandler) private readonly commandHandler: RegistrarFormularioCommandHandler,
  ) {}

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const input = (event as any).validatedInput as RegisterFormularioInput;
      const originalBody = (event as any).originalBody as Record<string, unknown>;

      const camposAdicionales = this.extraerCamposAdicionales(originalBody);

      const command = new RegistrarFormularioCommand(
        input.nombres,
        input.apellidos,
        input.tipoDocumento,
        input.numeroDocumento,
        input.celular,
        input.email,
        input.tratamientoDatos,
        camposAdicionales,
      );

      const result = await this.commandHandler.execute(command);

      if (!result.isSuccess()) {
        const error = result.getError();
        return {
          statusCode: 400,
          headers: HEADERS,
          body: JSON.stringify({
            code: "VALIDATION_ERROR",
            message: error?.message || "Validation failed",
          }),
        };
      }

      return {
        statusCode: 201,
        headers: HEADERS,
        body: JSON.stringify(RegisterFormularioOutput.success(result.getValue())),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: HEADERS,
        body: JSON.stringify({
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      };
    }
  }

  private extraerCamposAdicionales(body: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!body) return undefined;

    const adicionales: Record<string, unknown> = {};
    for (const key of Object.keys(body)) {
      if (!CAMPOS_OBLIGATORIOS.includes(key)) {
        adicionales[key] = body[key];
      }
    }

    return Object.keys(adicionales).length > 0 ? adicionales : undefined;
  }
}

const baseHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const container = buildContainer();
  const handler = container.get<RegisterFormularioHandler>(TYPES.RegisterFormularioHandler);
  return handler.handle(event);
};

export const register = middy(baseHandler)
  .use(validatorMiddleware({ inputClass: RegisterFormularioInput }))
  .use(httpErrorHandler());
