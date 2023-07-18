import { ConsolaInstance, createConsola } from 'consola';

export class Debugger {
  private logger: ConsolaInstance;

  constructor(isDebug: boolean) {
    this.logger = createConsola({
      level: isDebug ? 5 : -1, // 5 enables all levels, -1 disables all levels
      fancy: true,
    });
  }

  ready(message: string): void {
    this.logger.ready(message);
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  success(message: string): void {
    this.logger.success(message);
  }
}
