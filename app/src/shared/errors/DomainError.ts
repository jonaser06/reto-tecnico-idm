export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends DomainError {}

export class InvalidEmailError extends ValidationError {
  constructor(correo: string) {
    super(`Correo inválido: ${correo}`);
  }
}

export class InvalidCelularError extends ValidationError {
  constructor(celular: string) {
    super(`Celular inválido: ${celular}`);
  }
}

export class InvalidTipoDocumentoError extends ValidationError {
  constructor(tipo: string) {
    super(`Tipo de documento inválido: ${tipo}. Debe ser DNI, CE o PASAPORTE`);
  }
}

export class TratamientoDatosNotAcceptedError extends ValidationError {
  constructor() {
    super("Debe aceptar el tratamiento de datos");
  }
}

export class InvalidNombreError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidApellidoError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidNumeroDocumentoError extends ValidationError {
  constructor(message: string) {
    super(message);
  }
}
