import { v4 as uuidv4 } from "uuid";

export class FormularioId {
  private constructor(private readonly value: string) {}

  static create(id?: string): FormularioId {
    return new FormularioId(id || uuidv4());
  }

  getValue(): string {
    return this.value;
  }
}
