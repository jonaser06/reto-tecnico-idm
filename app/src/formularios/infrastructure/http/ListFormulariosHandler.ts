import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { injectable, inject } from "inversify";
import { ListFormulariosOutput } from "./outputs/ListFormulariosOutput";
import { TYPES } from "../../../shared/infrastructure/container/types";
import { ListarFormulariosQueryHandler } from "../../application/queries/ListarFormularios/ListarFormulariosQueryHandler";
import { buildContainer } from "../../../shared/infrastructure/container/container";

@injectable()
export class ListFormulariosHandler {
  constructor(
    @inject(TYPES.ListarFormulariosQueryHandler) private readonly queryHandler: ListarFormulariosQueryHandler,
  ) {}

  async handle(): Promise<APIGatewayProxyResult> {
    try {
      const dtos = await this.queryHandler.execute();
      const output = ListFormulariosOutput.success(dtos);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(output),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      };
    }
  }
}

const baseHandler = async (): Promise<APIGatewayProxyResult> => {
  const container = buildContainer();
  const handler = container.get<ListFormulariosHandler>(TYPES.ListFormulariosHandler);
  return handler.handle();
};

export const list = middy(baseHandler).use(httpErrorHandler());
