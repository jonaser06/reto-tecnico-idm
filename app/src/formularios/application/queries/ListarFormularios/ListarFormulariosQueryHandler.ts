import { injectable, inject } from "inversify";
import { IFormularioRepository } from "../../../domain/repositories/IFormularioRepository";
import { FormularioDTO } from "../../dtos/FormularioDTO";
import { TYPES } from "../../../../shared/infrastructure/container/types";

@injectable()
export class ListarFormulariosQueryHandler {
  constructor(
    @inject(TYPES.FormularioRepository) private readonly repository: IFormularioRepository,
  ) {}

  async execute(): Promise<FormularioDTO[]> {
    const formularios = await this.repository.findAll();

    return formularios.map((formulario) => ({
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
    }));
  }
}
