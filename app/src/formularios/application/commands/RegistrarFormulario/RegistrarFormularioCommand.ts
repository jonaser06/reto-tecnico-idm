export class RegistrarFormularioCommand {
  constructor(
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly tipo_documento: string,
    public readonly numero_documento: string,
    public readonly celular: string,
    public readonly correo: string,
    public readonly tratamiento_datos: boolean,
    public readonly camposAdicionales?: Record<string, unknown>,
  ) {}
}
