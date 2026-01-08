import { TipoDocumento } from "../../../../../src/formularios/domain/value-objects/TipoDocumento";

describe("TipoDocumento Value Object", () => {
  describe("create", () => {
    it("debería crear CC (Cédula de Ciudadanía)", () => {
      const result = TipoDocumento.create("CC");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("CC");
    });

    it("debería crear CE (Cédula de Extranjería)", () => {
      const result = TipoDocumento.create("CE");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("CE");
    });

    it("debería crear PA (Pasaporte)", () => {
      const result = TipoDocumento.create("PA");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("PA");
    });

    it("debería rechazar tipo de documento inválido", () => {
      const result = TipoDocumento.create("TI");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("CC, CE o PA");
    });

    it("debería rechazar tipo de documento vacío", () => {
      const result = TipoDocumento.create("");

      expect(result.isSuccess()).toBe(false);
    });

    it("debería rechazar tipo de documento en minúsculas", () => {
      const result = TipoDocumento.create("cc");

      expect(result.isSuccess()).toBe(false);
    });
  });
});
