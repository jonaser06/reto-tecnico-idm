import { injectable, inject } from "inversify";
import { IFormularioRepository } from "../../domain/repositories/IFormularioRepository";
import { Formulario } from "../../domain/entities/Formulario";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FormularioMapper, DynamoDBItem } from "./FormularioMapper";
import { TYPES } from "../../../shared/infrastructure/container/types";

const TABLE_NAME = process.env.FORMULARIOS_TABLE || "formularios-dev";

@injectable()
export class DynamoDBFormularioRepository implements IFormularioRepository {
  constructor(@inject(TYPES.DynamoDBClient) private readonly docClient: DynamoDBDocumentClient) {}

  async save(formulario: Formulario): Promise<void> {
    const item = FormularioMapper.toPersistence(formulario);

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    await this.docClient.send(command);
  }

  async findAll(): Promise<Formulario[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await this.docClient.send(command);
    const items = response.Items || [];

    return items.map((item) => FormularioMapper.toDomain(item as DynamoDBItem));
  }

  async findByDocumento(tipoDocumento: string, numeroDocumento: string): Promise<Formulario | null> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "DocumentoIndex",
      KeyConditionExpression: "tipo_documento = :tipo AND numero_documento = :numero",
      ExpressionAttributeValues: {
        ":tipo": tipoDocumento,
        ":numero": numeroDocumento,
      },
    });

    const response = await this.docClient.send(command);
    const items = response.Items || [];

    if (items.length === 0) {
      return null;
    }

    return FormularioMapper.toDomain(items[0] as DynamoDBItem);
  }
}
