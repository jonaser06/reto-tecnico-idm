import { Formulario } from "../../domain/entities/Formulario";
import { FormularioId } from "../../domain/value-objects/FormularioId";
import { Email } from "../../domain/value-objects/Email";
import { Celular } from "../../domain/value-objects/Celular";
import { TipoDocumento } from "../../domain/value-objects/TipoDocumento";
import { NumeroDocumento } from "../../domain/value-objects/NumeroDocumento";

export interface DynamoDBItem {
  id: string;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  celular: string;
  email: string;
  tratamiento_datos: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Permitir campos adicionales dinámicos
}

export class FormularioMapper {
  static toPersistence(formulario: Formulario): DynamoDBItem {
    const baseItem: DynamoDBItem = {
      id: formulario.id.getValue(),
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      tipo_documento: formulario.tipoDocumento.getValue(),
      numero_documento: formulario.numeroDocumento.getValue(),
      celular: formulario.celular.getValue(),
      email: formulario.email.getValue(),
      tratamiento_datos: formulario.tratamientoDatos,
      createdAt: formulario.createdAt.toISOString(),
      updatedAt: formulario.updatedAt.toISOString(),
    };

    // Expandir campos adicionales al nivel superior
    if (formulario.camposAdicionales) {
      Object.keys(formulario.camposAdicionales).forEach((key) => {
        baseItem[key] = formulario.camposAdicionales![key];
      });
    }

    return baseItem;
  }

  static toDomain(item: DynamoDBItem): Formulario {
    const email = Email.create(item.email).getValue();
    const celular = Celular.create(item.celular).getValue();
    const tipoDocumento = TipoDocumento.create(item.tipo_documento).getValue();
    const numeroDocumento = NumeroDocumento.create(item.numero_documento).getValue();

    // Extraer campos adicionales (todos los que no son campos base)
    const camposBase = [
      "id",
      "nombres",
      "apellidos",
      "tipo_documento",
      "numero_documento",
      "celular",
      "email",
      "tratamiento_datos",
      "createdAt",
      "updatedAt",
    ];

    const camposAdicionales: Record<string, unknown> = {};
    Object.keys(item).forEach((key) => {
      if (!camposBase.includes(key)) {
        camposAdicionales[key] = item[key];
      }
    });

    const formularioResult = Formulario.create({
      id: FormularioId.create(item.id),
      nombres: item.nombres,
      apellidos: item.apellidos,
      tipoDocumento,
      numeroDocumento,
      celular,
      email: email,
      tratamientoDatos: item.tratamiento_datos,
      camposAdicionales: Object.keys(camposAdicionales).length > 0 ? camposAdicionales : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    });

    return formularioResult.getValue();
  }
}
