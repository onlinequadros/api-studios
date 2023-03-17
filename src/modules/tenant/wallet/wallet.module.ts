import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsProfessionalController } from './wallet.controller';
import { WalletsProfessionalService } from './wallet.service';
import { Orders } from '../orders/entities/orders.entity';
import { MailsStudioModule } from '../mails/mail-studio.module';
import { Client } from '../clients/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Orders, Client]),
    MailsStudioModule,
  ],
  controllers: [WalletsProfessionalController],
  providers: [WalletsProfessionalService],
  exports: [],
})
export class WalletProfessionalModule {}
