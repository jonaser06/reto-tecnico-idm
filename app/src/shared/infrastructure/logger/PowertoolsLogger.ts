import { Logger as PowertoolsLoggerBase } from "@aws-lambda-powertools/logger";
import { injectable } from "inversify";
import { ILogger } from "./ILogger";

@injectable()
export class PowertoolsLogger implements ILogger {
  private logger: PowertoolsLoggerBase;

  constructor(serviceName: string = "formularios-microservice") {
    this.logger = new PowertoolsLoggerBase({
      serviceName,
      logLevel: (process.env.LOG_LEVEL || "INFO") as "DEBUG" | "INFO" | "WARN" | "ERROR",
    });
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (error instanceof Error) {
      this.logger.error(message, { error: error.message, stack: error.stack, ...args });
    } else {
      this.logger.error(message, { error, ...args });
    }
  }

  addContext(key: string, value: any): void {
    this.logger.appendKeys({ [key]: value });
  }
}
