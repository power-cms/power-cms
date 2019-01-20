import * as defaultConfig from '../../src/moleculer.config';

export const config = Object.assign({}, defaultConfig, {
  transporter: null,
  logger: false,
});
