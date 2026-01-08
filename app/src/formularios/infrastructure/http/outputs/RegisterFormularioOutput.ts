import { FormularioDTO } from "../../../application/dtos/FormularioDTO";

export class RegisterFormularioOutput {
  code: string;
  message: string;
  data: FormularioDTO;

  constructor(code: string, message: string, data: FormularioDTO) {
    this.code = code;
    this.message = message;
    this.data = { ...data };
  }

  static success(dto: FormularioDTO): RegisterFormularioOutput {
    return new RegisterFormularioOutput("SUCCESS", "Formulario registrado exitosamente", dto);
  }
}
