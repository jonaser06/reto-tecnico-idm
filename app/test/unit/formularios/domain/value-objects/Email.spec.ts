import { Email } from "../../../../../src/formularios/domain/value-objects/Email";

describe("Email Value Object", () => {
  describe("create", () => {
    it("debería crear un email válido", () => {
      const result = Email.create("test@example.com");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("test@example.com");
    });

    it("debería rechazar email vacío", () => {
      const result = Email.create("");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Email inválido");
    });

    it("debería rechazar email sin @", () => {
      const result = Email.create("invalidemail.com");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Email inválido");
    });

    it("debería rechazar email sin dominio", () => {
      const result = Email.create("test@");

      expect(result.isSuccess()).toBe(false);
    });

    it("debería aceptar emails con subdominios", () => {
      const result = Email.create("user@mail.example.com");

      expect(result.isSuccess()).toBe(true);
    });

    it("debería aceptar emails con números", () => {
      const result = Email.create("user123@example.com");

      expect(result.isSuccess()).toBe(true);
    });
  });
});
