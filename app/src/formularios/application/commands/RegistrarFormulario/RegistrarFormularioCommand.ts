export class RegistrarFormularioCommand {
  constructor(
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly tipoDocumento: string,
    public readonly numeroDocumento: string,
    public readonly celular: string,
    public readonly email: string,
    public readonly tratamientoDatos: boolean,
    public readonly camposAdicionales?: Record<string, unknown>,
  ) {}
}
