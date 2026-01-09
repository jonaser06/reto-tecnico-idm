import { IsString, IsBoolean, IsEmail, Length, Matches, IsNotEmpty } from "class-validator";

export class RegisterFormularioInput {
  @IsString()
  @IsNotEmpty({ message: "El nombre es requerido" })
  @Length(2, 100, { message: "El nombre debe tener entre 2 y 100 caracteres" })
  nombre!: string;

  @IsString()
  @IsNotEmpty({ message: "El apellido es requerido" })
  @Length(2, 100, { message: "El apellido debe tener entre 2 y 100 caracteres" })
  apellido!: string;

  @IsString()
  @IsNotEmpty({ message: "El tipo de documento es requerido" })
  @Matches(/^(DNI|CE|PASAPORTE)$/, { message: "Tipo de documento debe ser DNI, CE o PASAPORTE" })
  tipo_documento!: string;

  @IsString()
  @IsNotEmpty({ message: "El número de documento es requerido" })
  @Matches(/^[a-zA-Z0-9]+$/, { message: "Número de documento solo puede contener letras y números" })
  numero_documento!: string;

  @IsEmail({}, { message: "Correo inválido" })
  @IsNotEmpty({ message: "El correo es requerido" })
  correo!: string;

  @IsString()
  @IsNotEmpty({ message: "El celular es requerido" })
  @Matches(/^\+?[0-9]{9,15}$/, { message: "Celular inválido" })
  celular!: string;

  @IsBoolean({ message: "tratamiento_datos debe ser un booleano" })
  tratamiento_datos!: boolean;

  [key: string]: unknown;
}
