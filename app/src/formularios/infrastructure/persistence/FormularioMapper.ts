import { Formulario } from "../../domain/entities/Formulario";
import { FormularioId } from "../../domain/value-objects/FormularioId";
import { Email } from "../../domain/value-objects/Email";
import { Celular } from "../../domain/value-objects/Celular";
import { TipoDocumento } from "../../domain/value-objects/TipoDocumento";
import { NumeroDocumento } from "../../domain/value-objects/NumeroDocumento";

export interface DynamoDBItem {
  id: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  celular: string;
  correo: string;
  tratamiento_datos: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

const CAMPOS_BASE = [
  "id",
  "nombre",
  "apellido",
  "tipo_documento",
  "numero_documento",
  "celular",
  "correo",
  "tratamiento_datos",
  "createdAt",
  "updatedAt",
];

export class FormularioMapper {
  static toPersistence(formulario: Formulario): DynamoDBItem {
    const baseItem: DynamoDBItem = {
      id: formulario.id.getValue(),
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      tipo_documento: formulario.tipo_documento.getValue(),
      numero_documento: formulario.numero_documento.getValue(),
      celular: formulario.celular.getValue(),
      correo: formulario.correo.getValue(),
      tratamiento_datos: formulario.tratamiento_datos,
      createdAt: formulario.createdAt.toISOString(),
      updatedAt: formulario.updatedAt.toISOString(),
    };

    if (formulario.camposAdicionales) {
      Object.assign(baseItem, formulario.camposAdicionales);
    }

    return baseItem;
  }

  static toDomain(item: DynamoDBItem): Formulario {
    const correo = Email.create(item.correo).getValue();
    const celular = Celular.create(item.celular).getValue();
    const tipo_documento = TipoDocumento.create(item.tipo_documento).getValue();
    const numero_documento = NumeroDocumento.create(item.numero_documento).getValue();

    const camposAdicionales: Record<string, unknown> = {};
    for (const key of Object.keys(item)) {
      if (!CAMPOS_BASE.includes(key)) {
        camposAdicionales[key] = item[key];
      }
    }

    const formularioResult = Formulario.create({
      id: FormularioId.create(item.id),
      nombre: item.nombre,
      apellido: item.apellido,
      tipo_documento,
      numero_documento,
      celular,
      correo,
      tratamiento_datos: item.tratamiento_datos,
      camposAdicionales: Object.keys(camposAdicionales).length > 0 ? camposAdicionales : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });

    return formularioResult.getValue();
  }
}
