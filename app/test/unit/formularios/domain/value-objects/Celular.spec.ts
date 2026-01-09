import { Celular } from "../../../../../src/formularios/domain/value-objects/Celular";

describe("Celular Value Object", () => {
  describe("create", () => {
    it("deberia crear un celular valido de 10 digitos", () => {
      const result = Celular.create("3001234567");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("3001234567");
    });

    it("deberia crear un celular valido con codigo de pais", () => {
      const result = Celular.create("+51987654321");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("+51987654321");
    });

    it("deberia rechazar celular vacio", () => {
      const result = Celular.create("");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Celular");
    });

    it("deberia rechazar celular con menos de 9 digitos", () => {
      const result = Celular.create("12345678");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Celular");
    });

    it("deberia rechazar celular con mas de 15 digitos", () => {
      const result = Celular.create("1234567890123456");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Celular");
    });

    it("deberia rechazar celular con letras", () => {
      const result = Celular.create("300ABC1234");

      expect(result.isSuccess()).toBe(false);
    });

    it("deberia rechazar celular null", () => {
      const result = Celular.create(null as any);

      expect(result.isSuccess()).toBe(false);
    });
  });
});
