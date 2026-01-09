import { injectable, inject } from "inversify";
import { Result } from "../../../../shared/types/Result";
import { IFormularioRepository } from "../../../domain/repositories/IFormularioRepository";
import { Formulario } from "../../../domain/entities/Formulario";
import { Email } from "../../../domain/value-objects/Email";
import { Celular } from "../../../domain/value-objects/Celular";
import { TipoDocumento } from "../../../domain/value-objects/TipoDocumento";
import { NumeroDocumento } from "../../../domain/value-objects/NumeroDocumento";
import { RegistrarFormularioCommand } from "./RegistrarFormularioCommand";
import { FormularioDTO } from "../../dtos/FormularioDTO";
import { TYPES } from "../../../../shared/infrastructure/container/types";

@injectable()
export class RegistrarFormularioCommandHandler {
  constructor(@inject(TYPES.FormularioRepository) private readonly repository: IFormularioRepository) {}

  async execute(command: RegistrarFormularioCommand): Promise<Result<FormularioDTO>> {
    // Validar value objects
    const correoResult = Email.create(command.correo);
    if (!correoResult.isSuccess()) return Result.fail(correoResult.getError());

    const celularResult = Celular.create(command.celular);
    if (!celularResult.isSuccess()) return Result.fail(celularResult.getError());

    const tipoDocumentoResult = TipoDocumento.create(command.tipo_documento);
    if (!tipoDocumentoResult.isSuccess()) return Result.fail(tipoDocumentoResult.getError());

    const numeroDocumentoResult = NumeroDocumento.create(command.numero_documento);
    if (!numeroDocumentoResult.isSuccess()) return Result.fail(numeroDocumentoResult.getError());

    // Crear entidad
    const formularioResult = Formulario.create({
      nombre: command.nombre,
      apellido: command.apellido,
      tipo_documento: tipoDocumentoResult.getValue(),
      numero_documento: numeroDocumentoResult.getValue(),
      celular: celularResult.getValue(),
      correo: correoResult.getValue(),
      tratamiento_datos: command.tratamiento_datos,
      camposAdicionales: command.camposAdicionales,
    });

    if (!formularioResult.isSuccess()) return Result.fail(formularioResult.getError());

    const formulario = formularioResult.getValue();

    // Verificar duplicado
    const existingFormulario = await this.repository.findByDocumento(
      formulario.tipo_documento.getValue(),
      formulario.numero_documento.getValue(),
    );

    if (existingFormulario) {
      return Result.fail(
        new Error(
          `Ya existe un formulario con documento ${formulario.tipo_documento.getValue()} ${formulario.numero_documento.getValue()}`,
        ),
      );
    }

    // Persistir
    try {
      await this.repository.save(formulario);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error("Error al guardar el formulario"));
    }

    // Construir DTO de respuesta
    const dto: FormularioDTO = {
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
      ...(formulario.camposAdicionales || {}),
    };

    return Result.ok(dto);
  }
}
