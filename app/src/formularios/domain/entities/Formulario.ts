import { Result } from "../../../shared/types/Result";
import { FormularioId } from "../value-objects/FormularioId";
import { Email } from "../value-objects/Email";
import { Celular } from "../value-objects/Celular";
import { TipoDocumento } from "../value-objects/TipoDocumento";
import { NumeroDocumento } from "../value-objects/NumeroDocumento";
import {
  TratamientoDatosNotAcceptedError,
  InvalidNombresError,
  InvalidApellidosError,
} from "../../../shared/errors/DomainError";

interface FormularioProps {
  id?: FormularioId;
  nombres: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: NumeroDocumento;
  celular: Celular;
  email: Email;
  tratamientoDatos: boolean;
  camposAdicionales?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Formulario {
  private constructor(
    public readonly id: FormularioId,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly tipoDocumento: TipoDocumento,
    public readonly numeroDocumento: NumeroDocumento,
    public readonly celular: Celular,
    public readonly email: Email,
    public readonly tratamientoDatos: boolean,
    public readonly camposAdicionales: Record<string, unknown> | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: FormularioProps): Result<Formulario> {
    if (!props.tratamientoDatos) {
      return Result.fail(new TratamientoDatosNotAcceptedError());
    }

    const nombres = props.nombres?.trim() || "";
    const apellidos = props.apellidos?.trim() || "";

    if (!nombres || nombres.length < 2 || nombres.length > 100) {
      return Result.fail(new InvalidNombresError("El nombre es requerido y debe tener entre 2 y 100 caracteres"));
    }

    if (!apellidos || apellidos.length < 2 || apellidos.length > 100) {
      return Result.fail(new InvalidApellidosError("El apellido es requerido y debe tener entre 2 y 100 caracteres"));
    }

    const formulario = new Formulario(
      props.id || FormularioId.create(),
      nombres,
      apellidos,
      props.tipoDocumento,
      props.numeroDocumento,
      props.celular,
      props.email,
      props.tratamientoDatos,
      props.camposAdicionales,
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
    );

    return Result.ok(formulario);
  }
}
