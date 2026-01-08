import { Result } from "../../../shared/types/Result";
import { InvalidNumeroDocumentoError } from "../../../shared/errors/DomainError";

export class NumeroDocumento {
  private constructor(private readonly value: string) {}

  static create(numero: string): Result<NumeroDocumento> {
    if (!numero) {
      return Result.fail(new InvalidNumeroDocumentoError("El número de documento es requerido"));
    }
    const trimmed = numero.trim();
    if (trimmed.length === 0) {
      return Result.fail(new InvalidNumeroDocumentoError("Número de documento no puede estar vacío"));
    }
    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      return Result.fail(new InvalidNumeroDocumentoError("Número de documento solo puede contener letras y números"));
    }
    return Result.ok(new NumeroDocumento(trimmed));
  }

  getValue(): string {
    return this.value;
  }
}
