import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CompaniesModule } from 'src/modules/master/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), CompaniesModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
