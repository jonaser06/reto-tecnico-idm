import { IsString, IsBoolean, IsEmail, Length, Matches, IsNotEmpty } from "class-validator";

export class RegisterFormularioInput {
  @IsString()
  @IsNotEmpty({ message: "El nombre es requerido" })
  @Length(2, 100, { message: "Nombres debe tener entre 2 y 100 caracteres" })
  nombres!: string;

  @IsString()
  @IsNotEmpty({ message: "El apellido es requerido" })
  @Length(2, 100, { message: "Apellidos debe tener entre 2 y 100 caracteres" })
  apellidos!: string;

  @IsString()
  @IsNotEmpty({ message: "El tipo de documento es requerido" })
  @Matches(/^(CC|CE|PA)$/, { message: "Tipo de documento debe ser CC, CE o PA" })
  tipoDocumento!: string;

  @IsString()
  @IsNotEmpty({ message: "El número de documento es requerido" })
  @Matches(/^[a-zA-Z0-9]+$/, { message: "Número de documento solo puede contener letras y números" })
  numeroDocumento!: string;

  @IsEmail({}, { message: "Email inválido" })
  @IsNotEmpty({ message: "El email es requerido" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "El celular es requerido" })
  @Matches(/^\+?[0-9]{9,15}$/, { message: "Celular inválido" })
  celular!: string;

  @IsBoolean({ message: "tratamientoDatos debe ser un booleano" })
  tratamientoDatos!: boolean;

  // Index signature para campos adicionales dinámicos
  [key: string]: unknown;
}
