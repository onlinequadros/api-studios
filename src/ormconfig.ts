const typeOrmConfig = {
  type: process.env.CMS_POSTGRES_TYPE,
  host: process.env.CMS_POSTGRES_HOST,
  port: process.env.CMS_POSTGRES_PORT,
  username: process.env.CMS_POSTGRES_USER,
  password: process.env.CMS_POSTGRES_PASSWORD,
  database: process.env.CMS_POSTGRES_DB_NAME,
  logging: true,
  autoLoadEntities: true,
  entities: ['./modules/**/entities/*.entity{.ts,.js}'],
  migrations: ['./shared/migrations/*{.ts,.js}'],
};

export = typeOrmConfig;
