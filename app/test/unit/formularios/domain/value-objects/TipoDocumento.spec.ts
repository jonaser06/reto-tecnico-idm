import { TipoDocumento } from "../../../../../src/formularios/domain/value-objects/TipoDocumento";

describe("TipoDocumento Value Object", () => {
  describe("create", () => {
    it("deberia crear DNI", () => {
      const result = TipoDocumento.create("DNI");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("DNI");
    });

    it("deberia crear CE (Carnet de Extranjeria)", () => {
      const result = TipoDocumento.create("CE");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("CE");
    });

    it("deberia crear PASAPORTE", () => {
      const result = TipoDocumento.create("PASAPORTE");

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().getValue()).toBe("PASAPORTE");
    });

    it("deberia rechazar tipo de documento invalido", () => {
      const result = TipoDocumento.create("CC");

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("DNI, CE o PASAPORTE");
    });

    it("deberia rechazar tipo de documento vacio", () => {
      const result = TipoDocumento.create("");

      expect(result.isSuccess()).toBe(false);
    });

    it("deberia rechazar tipo de documento en minusculas", () => {
      const result = TipoDocumento.create("dni");

      expect(result.isSuccess()).toBe(false);
    });
  });
});
