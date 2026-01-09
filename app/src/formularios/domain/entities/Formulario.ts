import { Result } from "../../../shared/types/Result";
import { FormularioId } from "../value-objects/FormularioId";
import { Email } from "../value-objects/Email";
import { Celular } from "../value-objects/Celular";
import { TipoDocumento } from "../value-objects/TipoDocumento";
import { NumeroDocumento } from "../value-objects/NumeroDocumento";
import {
  TratamientoDatosNotAcceptedError,
  InvalidNombreError,
  InvalidApellidoError,
} from "../../../shared/errors/DomainError";

interface FormularioProps {
  id?: FormularioId;
  nombre: string;
  apellido: string;
  tipo_documento: TipoDocumento;
  numero_documento: NumeroDocumento;
  celular: Celular;
  correo: Email;
  tratamiento_datos: boolean;
  camposAdicionales?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Formulario {
  private constructor(
    public readonly id: FormularioId,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly tipo_documento: TipoDocumento,
    public readonly numero_documento: NumeroDocumento,
    public readonly celular: Celular,
    public readonly correo: Email,
    public readonly tratamiento_datos: boolean,
    public readonly camposAdicionales: Record<string, unknown> | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: FormularioProps): Result<Formulario> {
    if (!props.tratamiento_datos) {
      return Result.fail(new TratamientoDatosNotAcceptedError());
    }

    const nombre = props.nombre?.trim() || "";
    const apellido = props.apellido?.trim() || "";

    if (!nombre || nombre.length < 2 || nombre.length > 100) {
      return Result.fail(new InvalidNombreError("El nombre es requerido y debe tener entre 2 y 100 caracteres"));
    }

    if (!apellido || apellido.length < 2 || apellido.length > 100) {
      return Result.fail(new InvalidApellidoError("El apellido es requerido y debe tener entre 2 y 100 caracteres"));
    }

    const formulario = new Formulario(
      props.id || FormularioId.create(),
      nombre,
      apellido,
      props.tipo_documento,
      props.numero_documento,
      props.celular,
      props.correo,
      props.tratamiento_datos,
      props.camposAdicionales,
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
    );

    return Result.ok(formulario);
  }
}
