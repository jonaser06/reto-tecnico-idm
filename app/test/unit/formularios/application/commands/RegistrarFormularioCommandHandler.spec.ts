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
      "Pérez",
      "CC",
      "1234567890",
      "3001234567",
      "juan@example.com",
      true,
      {},
    );

    it("debería registrar un formulario válido", async () => {
      mockRepository.findByDocumento.mockResolvedValue(null);

      const result = await handler.execute(validCommand);

      expect(result.isSuccess()).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it("debería rechazar email inválido", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Pérez",
        "CC",
        "1234567890",
        "3001234567",
        "invalid-email",
        true,
        {},
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería rechazar celular inválido", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Pérez",
        "CC",
        "1234567890",
        "123", // celular inválido
        "juan@example.com",
        true,
        {},
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería rechazar tipo de documento inválido", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Pérez",
        "TI", // tipo inválido
        "1234567890",
        "3001234567",
        "juan@example.com",
        true,
        {},
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
    });

    it("debería rechazar tratamiento de datos false", async () => {
      const invalidCommand = new RegistrarFormularioCommand(
        "Juan",
        "Pérez",
        "CC",
        "1234567890",
        "3001234567",
        "juan@example.com",
        false, // tratamientoDatos false
        {},
      );

      const result = await handler.execute(invalidCommand);

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("tratamiento de datos");
    });

    it("debería rechazar documento duplicado", async () => {
      mockRepository.findByDocumento.mockResolvedValue({} as Formulario);

      const result = await handler.execute(validCommand);

      expect(result.isSuccess()).toBe(false);
      expect(result.getError()?.message).toContain("Ya existe");
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("debería manejar errores de repositorio", async () => {
      mockRepository.findByDocumento.mockResolvedValue(null);
      mockRepository.save.mockRejectedValue(new Error("DB Error"));

      const result = await handler.execute(validCommand);

      expect(result.isSuccess()).toBe(false);
    });
  });
});
