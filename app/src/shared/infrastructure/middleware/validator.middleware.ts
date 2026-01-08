import middy from "@middy/core";
import { validate, ValidationError as ClassValidatorError } from "class-validator";
import { plainToClass } from "class-transformer";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export interface ValidatorMiddlewareOptions {
  inputClass: new () => any;
}

export const validatorMiddleware = (options: ValidatorMiddlewareOptions): middy.MiddlewareObj => {
  return {
    before: async (request) => {
      const { inputClass } = options;
      const event = request.event as APIGatewayProxyEvent;
      const body = JSON.parse(event.body || "{}");

      // Crear instancia para validación pero preservar el body original
      const input = plainToClass(inputClass, body, {
        excludeExtraneousValues: false,
        enableImplicitConversion: true,
        exposeUnsetFields: false,
      });

      // Copiar todas las propiedades del body original al input (incluyendo las adicionales)
      Object.keys(body).forEach((key) => {
        if (!(key in input)) {
          input[key] = body[key];
        }
      });

      const errors = await validate(input, {
        whitelist: false, // No eliminar propiedades no decoradas
        forbidNonWhitelisted: false, // Permitir propiedades adicionales
      });

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error: ClassValidatorError) => {
            return Object.values(error.constraints || {}).join(", ");
          })
          .join(", ");

        // Retornar directamente la respuesta en lugar de lanzar un error
        const response: APIGatewayProxyResult = {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            code: "VALIDATION_ERROR",
            message: errorMessages,
          }),
        };

        return response;
      }

      (request.event as any).validatedInput = input;
      (request.event as any).originalBody = body; // Guardar el body original
    },
  };
};
