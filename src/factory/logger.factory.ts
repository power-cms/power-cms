import { ILogger } from '@power-cms/common/application';
import { LoggerInstance } from 'moleculer';

type Level = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

export const createLogger = (moleculerLogger: LoggerInstance): ILogger => ({
  log(level: string, msg: string) {
    this[level as Level](msg);
  },
  error(msg: string) {
    moleculerLogger.error(msg);
  },
  warn(msg: string) {
    moleculerLogger.warn(msg);
  },
  info(msg: string) {
    moleculerLogger.info(msg);
  },
  verbose(msg: string) {
    moleculerLogger.trace(msg);
  },
  debug(msg: string) {
    moleculerLogger.debug(msg);
  },
});
