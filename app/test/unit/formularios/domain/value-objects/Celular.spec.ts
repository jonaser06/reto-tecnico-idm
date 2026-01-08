import { Celular } from "../../../../../src/formularios/domain/value-objects/Celular";

describe("Celular Value Object", () => {
  describe("create", () => {
    it("debería crear un celular válido de 10 dígitos", () => {
      const result = Celular.create("3001234567");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("3001234567");
    });

    it("debería rechazar celular vacío", () => {
      const result = Celular.create("");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Celular inválido");
    });

    it("debería rechazar celular con menos de 10 dígitos", () => {
      const result = Celular.create("12345678");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Celular inválido");
    });

    it("debería rechazar celular con más de 10 dígitos", () => {
      const result = Celular.create("1234567890123456");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Celular inválido");
    });

    it("debería rechazar celular con letras", () => {
      const result = Celular.create("300ABC1234");

      expect(result.isSuccess()).toBe(false);
    });

    it("debería rechazar celular null", () => {
      const result = Celular.create(null as any);

      expect(result.isSuccess()).toBe(false);
    });
  });
});
