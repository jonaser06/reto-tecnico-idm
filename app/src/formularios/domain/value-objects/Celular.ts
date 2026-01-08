import { Result } from "../../../shared/types/Result";
import { InvalidCelularError } from "../../../shared/errors/DomainError";

export class Celular {
  private constructor(private readonly value: string) {}

  static create(celular: string): Result<Celular> {
    if (!celular) {
      return Result.fail(new InvalidCelularError(celular));
    }
    const cleaned = celular.replace(/\s/g, "");
    if (!this.isValid(cleaned)) {
      return Result.fail(new InvalidCelularError(celular));
    }
    return Result.ok(new Celular(cleaned));
  }

  private static isValid(celular: string): boolean {
    const celularRegex = /^\+?[0-9]{9,15}$/;
    return celularRegex.test(celular);
  }

  getValue(): string {
    return this.value;
  }
}
