import { Result } from "../../../shared/types/Result";
import { InvalidEmailError } from "../../../shared/errors/DomainError";

export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Result<Email> {
    if (!email || !this.isValid(email)) {
      return Result.fail(new InvalidEmailError(email));
    }
    return Result.ok(new Email(email.toLowerCase().trim()));
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }
}
