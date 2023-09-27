import { Injectable, Scope } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductStudioService } from '../product_studio/product-studio.service';
import { CompaniesService } from 'src/modules/master/companies/companies.service';
import * as moment from 'moment';
import { resolve } from 'path';
import { MailsStudioService } from '../mails/mail-studio.service';

@Injectable({ scope: Scope.DEFAULT })
export class CronSendMessageService {
  constructor(
    private readonly productService: ProductStudioService,
    private readonly companiesService: CompaniesService,
    private readonly mailsService: MailsStudioService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendEmailDeadline() {
    // Pega todos os estúdios do sistema
    const results = await this.companiesService.getAllStudios();
    const studios = results.map((studio) => studio.tenant_company);

    for (const studio of studios) {
      // Pega todos os álbuns do estúdio
      const albums = await this.productService.findAlbumsInStudio(studio);

      if (albums.length > 0) {
        // Varre álbum por álbum verificando o deadline
        for (const album of albums) {
          const todayDate = new Date();
          const dateToday = moment(todayDate, 'YYYY-MM-DD');
          const dateDeadline = moment(album.deadline, 'YYYY-MM-DD');
          const daysDeadline = dateDeadline.diff(dateToday, 'days');

          if (daysDeadline === 0 || daysDeadline === 1) {
            // Pega o array de usuários e vai enviando emails para os usuários
            for (const user of album.users) {
              // Instrução para envio de e-mail
              const templatePath = resolve(
                __dirname,
                '..',
                '..',
                '..',
                '..',
                'views',
                'emails',
                'deadline-first-alert.hbs',
              );
              const nameClient = `${user.name.toUpperCase()}`;
              const variables = {
                name: nameClient,
                datelimit: moment(album.deadline).format('DD/MM/YYYY'),
                namealbum: album.name,
                link_login: `${process.env.URL_PRINCIPAL}/${studio}`,
              };
              await this.mailsService.sendEmail(
                user.email,
                `Limite de acesso ao álbum ${album.name.toUpperCase()}`,
                variables,
                templatePath,
              );
            }
          }
        }
      }
    }
  }
}
