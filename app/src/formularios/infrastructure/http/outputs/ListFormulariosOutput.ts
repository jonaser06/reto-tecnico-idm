import { FormularioDTO } from "../../../application/dtos/FormularioDTO";

export class ListFormulariosOutput {
  code: string;
  message: string;
  count: number;
  data: FormularioDTO[];

  constructor(code: string, message: string, dtos: FormularioDTO[]) {
    this.code = code;
    this.message = message;
    this.count = dtos.length;
    this.data = dtos.map((dto) => ({ ...dto }));
  }

  static success(dtos: FormularioDTO[]): ListFormulariosOutput {
    return new ListFormulariosOutput("SUCCESS", "Formularios obtenidos exitosamente", dtos);
  }
}
