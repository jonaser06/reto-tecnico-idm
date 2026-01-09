export interface FormularioDTO {
  id: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  celular: string;
  correo: string;
  tratamiento_datos: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}
