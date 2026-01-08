export class Result<T> {
  private constructor(
    private readonly success: boolean,
    private readonly value?: T,
    private readonly error?: any,
  ) {}

  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, value);
  }

  static fail<U>(error: any): Result<U> {
    return new Result<U>(false, undefined, error);
  }

  isSuccess(): boolean {
    return this.success;
  }

  getValue(): T {
    if (!this.success) {
      throw new Error("Cannot get value from failed result");
    }
    return this.value!;
  }

  getError(): any {
    return this.error;
  }
}
