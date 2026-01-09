import { Email } from "../../../../../src/formularios/domain/value-objects/Email";

describe("Email Value Object", () => {
  describe("create", () => {
    it("deberia crear un correo valido", () => {
      const result = Email.create("test@example.com");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("test@example.com");
    });

    it("deberia rechazar correo vacio", () => {
      const result = Email.create("");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Correo");
    });

    it("deberia rechazar correo sin @", () => {
      const result = Email.create("correo-invalido.com");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Correo");
    });

    it("deberia rechazar correo sin dominio", () => {
      const result = Email.create("test@");

      expect(result.isSuccess()).toBe(false);
    });

    it("deberia aceptar correos con subdominios", () => {
      const result = Email.create("user@mail.example.com");

      expect(result.isSuccess()).toBe(true);
    });

    it("deberia aceptar correos con numeros", () => {
      const result = Email.create("user123@example.com");

      expect(result.isSuccess()).toBe(true);
    });
  });
});
