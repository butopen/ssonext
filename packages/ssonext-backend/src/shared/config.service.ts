import { Injectable } from '@nestjs/common';
import { EmailConfiguration } from '../email/email.service';
import { DBConfig } from './postgres-db.service';

export interface Config {
  db: DBConfig;
  email: EmailConfiguration;
  master_password: string;
  backend_url: string;
}

function initGlobalConfig() {
  const {
    DB_HOST,
    DB_USRENAME,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    SSO_MASTER_PASSWORD,
    SSO_BACKEND_URL,
    SSO_EMAIL_AWS_REGION,
    SSO_EMAIL_AWS_API_VERSION,
    SSO_EMAIL_AWS_ACCESS_KEY_ID,
    SSO_EMAIL_AWS_SECRET_ACCESS_KEY,
    SSO_DEFAULT_FROM,
    SSO_DEFAULT_COLOR,
  } = process.env;

  return {
    db: {
      host: DB_HOST,
      user: DB_USRENAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: +DB_PORT,
    },
    master_password: SSO_MASTER_PASSWORD,
    backend_url: SSO_BACKEND_URL,
    color: SSO_DEFAULT_COLOR || '#29ffad',
    email: {
      aws: {
        access_key_id: SSO_EMAIL_AWS_ACCESS_KEY_ID,
        secret_access_key: SSO_EMAIL_AWS_SECRET_ACCESS_KEY,
      },
      api_version: SSO_EMAIL_AWS_API_VERSION,
      default_from: SSO_DEFAULT_FROM,
      region: SSO_EMAIL_AWS_REGION,
    },
  };
}

export const globalConfig = initGlobalConfig();

@Injectable()
export class ConfigService implements Config {
  db: DBConfig;
  email: EmailConfiguration;
  master_password: string;
  backend_url: string;
  color: string;

  constructor() {
    const gc = initGlobalConfig();
    for (let k in gc) globalConfig[k] = gc[k];
    this.db = globalConfig.db as DBConfig;
    this.master_password = globalConfig.master_password;
    this.backend_url = globalConfig.backend_url;
    this.color = globalConfig.color;
    this.email = globalConfig.email;
  }
}
