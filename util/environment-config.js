import dotenv from 'dotenv';
import logger from './logger.js';
dotenv.config();

/**
 * Environment constants (enum-like object)
 */
export const Environments = {
  DEV: 'dev',
  QA: 'qa',
  PREPROD: 'preprod',
  PROD: 'prod',
  TEST: 'test'
};

/**
 * Comprehensive environment configuration
 */
const envConfig = {
  environments: {
    [Environments.DEV]: 'dev',
    [Environments.QA]: 'qa',
    [Environments.PREPROD]: 'preprod',
    [Environments.PROD]: 'prod',
    [Environments.TEST]: 'test'
  },

  environmentInfo: {
    [Environments.DEV]: { name: 'Development', emoji: '🔧' },
    [Environments.QA]: { name: 'Quality Assurance', emoji: '🧪' },
    [Environments.PREPROD]: { name: 'Pre-production', emoji: '🚧' },
    [Environments.PROD]: { name: 'Production', emoji: '🌐' },
    [Environments.TEST]: { name: 'Test', emoji: '🔍' }
  },
  current: (process.env.ENV_VARS?.toLowerCase() || Environments.PREPROD).trim(),
  get prefix() {
    const selectedPrefix = this.environments[this.current] || this.environments[Environments.PREPROD];
    return selectedPrefix;
  },

  get baseUrl() {
    const envInfo = this.getEnvironmentInfo(this.current);
    logger.info(`${envInfo.emoji} Running tests on ${envInfo.name} environment: ${this.current.toUpperCase()}`);
    return `https://${this.prefix}.mainpage.com`;
  },

  getEnvironmentInfo(env) {
    return this.environmentInfo[env] || { name: env, emoji: '❓' };
  },

  isValidEnvironment(env) {
    return Object.values(Environments).includes(env);
  },

  get validEnvironments() {
    return Object.values(Environments);
  },

  setEnvironment(env) {
    if (!this.isValidEnvironment(env)) {
      throw new Error(`Invalid environment: ${env}. Valid options: ${this.validEnvironments.join(', ')}`);
    }
    this.current = env;
    logger.info(`🔄 Environment changed to: ${this.getEnvironmentInfo(env).name} (${env})`);
  },
  getConfig(env = this.current) {
    if (!this.isValidEnvironment(env)) {
      throw new Error(`Invalid environment: ${env}`);
    }
    return {
      environment: env,
      prefix: this.environments[env],
      baseUrl: `https://${this.environments[env]}.mainpage.com`,
      info: this.getEnvironmentInfo(env)
    };
  }
};

export const validEnvironments = envConfig.validEnvironments;
export const isValidEnvironment = (env) => envConfig.isValidEnvironment(env);
export const getEnvironmentInfo = (env) => envConfig.getEnvironmentInfo(env);

export { envConfig };
export default envConfig;
