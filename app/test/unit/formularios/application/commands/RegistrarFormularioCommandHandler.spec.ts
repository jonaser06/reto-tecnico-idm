import { RegistrarFormularioCommandHandler } from "../../../../../src/formularios/application/commands/RegistrarFormulario/RegistrarFormularioCommandHandler";
import { RegistrarFormularioCommand } from "../../../../../src/formularios/application/commands/RegistrarFormulario/RegistrarFormularioCommand";
import { IFormularioRepository } from "../../../../../src/formularios/domain/repositories/IFormularioRepository";
import { Formulario } from "../../../../../src/formularios/domain/entities/Formulario";

describe("RegistrarFormularioCommandHandler", () => {
  let handler: RegistrarFormularioCommandHandler;
  let mockRepository: jest.Mocked<IFormularioRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByDocumento: jest.fn(),
    };

    handler = new RegistrarFormularioCommandHandler(mockRepository);
  });

  describe("execute", () => {
    const validCommand = new RegistrarFormularioCommand(
      "Juan",
      "Perez",
      "DNI",
      "12345678",
      "3001234567",
      "juan@example.com",
      true,
    );

    it("deberia registrar un formulario valido", async () => {
      mockRepository.findByDocumento.mockResolvedValue(null);

      const result = await handler.execute(validCommand);

      expect(result.isSuccess()).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it("deberia rechazar correo invalido", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Perez",
        "DNI",
        "12345678",
        "3001234567",
        "correo-invalido",
        true,
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("deberia rechazar celular invalido", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Perez",
        "DNI",
        "12345678",
        "123",
        "juan@example.com",
        true,
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("deberia rechazar tipo de documento invalido", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Perez",
        "CC",
        "12345678",
        "3001234567",
        "juan@example.com",
        true,
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
    });

    it("deberia rechazar tratamiento_datos false", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Perez",
        "DNI",
        "12345678",
        "3001234567",
        "juan@example.com",
        false,
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("tratamiento de datos");
    });

    it("deberia rechazar documento duplicado", async () => {
      mockRepository.findByDocumento.mockResolvedValue({} as Formulario);

      const result = await handler.execute(validCommand);

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Ya existe");
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("deberia manejar errores de repositorio", async () => {
      mockRepository.findByDocumento.mockResolvedValue(null);
      mockRepository.save.mockRejectedValue(new Error("DB Error"));

      const result = await handler.execute(validCommand);

      expect(result.isSuccess()).toBe(false);
    });

    it("deberia registrar formulario con campos adicionales", async () => {
      mockRepository.findByDocumento.mockResolvedValue(null);

      const commandConCamposAdicionales = new RegistrarFormularioCommand(
        "Maria",
        "Garcia",
        "CE",
        "CE123456",
        "3159876543",
        "maria@example.com",
        true,
        { empresa: "Tech Corp", cargo: "Gerente" },
      );

      const result = await handler.execute(commandConCamposAdicionales);

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue().empresa).toBe("Tech Corp");
      expect(result.getValue().cargo).toBe("Gerente");
    });
  });
});
