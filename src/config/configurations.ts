import * as dotenv from 'dotenv';

dotenv.config();

interface CMS_Postgres {
  HOST: string;
  PORT: any;
  USER: string;
  PASSWORD: string;
  DB_NAME: string;
}

const JWT_CONSTANTS = {
  secret: process.env.JWT_SECRET,
  expireIn: process.env.JWT_EXPIRE,
};

const CMS_POSTGRES: CMS_Postgres = {
  HOST: process.env.CMS_POSTGRES_HOST,
  PORT: parseInt(process.env.CMS_POSTGRES_PORT),
  USER: process.env.CMS_POSTGRES_USER,
  PASSWORD: process.env.CMS_POSTGRES_PASSWORD,
  DB_NAME: process.env.CMS_POSTGRES_DB_NAME,
};

export const config = {
  CMS_POSTGRES: CMS_POSTGRES,
  JWT_CONSTANTS: JWT_CONSTANTS,
};
