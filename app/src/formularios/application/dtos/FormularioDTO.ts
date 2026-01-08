export interface FormularioDTO {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  celular: string;
  email: string;
  tratamientoDatos: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Permite campos adicionales dinámicos
}
