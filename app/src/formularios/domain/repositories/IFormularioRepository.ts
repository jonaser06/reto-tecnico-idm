import { Formulario } from "../entities/Formulario";

export interface IFormularioRepository {
  save(formulario: Formulario): Promise<void>;
  findAll(): Promise<Formulario[]>;
  findByDocumento(tipoDocumento: string, numeroDocumento: string): Promise<Formulario | null>;
}
