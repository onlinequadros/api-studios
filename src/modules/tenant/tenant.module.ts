import { Module } from '@nestjs/common';
import { DatabaseModule } from '../shared/database/database.module';
import { DatabaseProvider } from '../shared/database/database.provider';
import { TenantProvider } from './tenant.provider';
import { TenantService } from './tenant.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [TenantProvider, TenantService, DatabaseProvider],
  exports: [TenantProvider, TenantService],
})
export class ClientModule {}
