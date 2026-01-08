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
    const emailResult = Email.create(command.email);
    if (!emailResult.isSuccess()) return Result.fail(emailResult.getError());

    const celularResult = Celular.create(command.celular);
    if (!celularResult.isSuccess()) return Result.fail(celularResult.getError());

    const tipoDocumentoResult = TipoDocumento.create(command.tipoDocumento);
    if (!tipoDocumentoResult.isSuccess()) return Result.fail(tipoDocumentoResult.getError());

    const numeroDocumentoResult = NumeroDocumento.create(command.numeroDocumento);
    if (!numeroDocumentoResult.isSuccess()) return Result.fail(numeroDocumentoResult.getError());

    // Crear entidad
    const formularioResult = Formulario.create({
      nombres: command.nombres,
      apellidos: command.apellidos,
      tipoDocumento: tipoDocumentoResult.getValue(),
      numeroDocumento: numeroDocumentoResult.getValue(),
      celular: celularResult.getValue(),
      email: emailResult.getValue(),
      tratamientoDatos: command.tratamientoDatos,
      camposAdicionales: command.camposAdicionales,
    });

    if (!formularioResult.isSuccess()) return Result.fail(formularioResult.getError());

    const formulario = formularioResult.getValue();

    // Verificar duplicado
    const existingFormulario = await this.repository.findByDocumento(
      formulario.tipoDocumento.getValue(),
      formulario.numeroDocumento.getValue(),
    );

    if (existingFormulario) {
      return Result.fail(
        new Error(
          `Ya existe un formulario con documento ${formulario.tipoDocumento.getValue()} ${formulario.numeroDocumento.getValue()}`,
        ),
      );
    }

    // Persistir con manejo de errores
    try {
      await this.repository.save(formulario);
    } catch (error) {
      return Result.fail(error instanceof Error ? error : new Error("Error al guardar el formulario"));
    }

    // Construir DTO de respuesta
    const dto: FormularioDTO = {
      id: formulario.id.getValue(),
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      tipoDocumento: formulario.tipoDocumento.getValue(),
      numeroDocumento: formulario.numeroDocumento.getValue(),
      celular: formulario.celular.getValue(),
      email: formulario.email.getValue(),
      tratamientoDatos: formulario.tratamientoDatos,
      createdAt: formulario.createdAt.toISOString(),
      updatedAt: formulario.updatedAt.toISOString(),
      ...(formulario.camposAdicionales || {}),
    };

    return Result.ok(dto);
  }
}
