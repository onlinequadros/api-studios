import { Connection } from 'typeorm';

export class TenantProvider {
  static connection: Connection;
}
