import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
