import { Result } from "../../../shared/types/Result";
import { InvalidTipoDocumentoError } from "../../../shared/errors/DomainError";

export enum TipoDocumentoEnum {
  CC = "CC",
  CE = "CE",
  PA = "PA",
}

export class TipoDocumento {
  private constructor(private readonly value: TipoDocumentoEnum) {}

  static create(tipo: string): Result<TipoDocumento> {
    if (!tipo || !Object.values(TipoDocumentoEnum).includes(tipo as TipoDocumentoEnum)) {
      return Result.fail(new InvalidTipoDocumentoError(tipo));
    }
    return Result.ok(new TipoDocumento(tipo as TipoDocumentoEnum));
  }

  getValue(): string {
    return this.value;
  }
}
