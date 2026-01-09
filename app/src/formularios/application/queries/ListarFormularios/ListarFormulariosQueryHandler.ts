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
    }));
  }
}
