import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailsService {
  async sendEmail(
    email: string,
    subject: string,
    variables: any,
    path: string,
  ) {
    const template = fs.readFileSync(path).toString('utf-8'); // pega o arquivo;

    const templateParse = Handlebars.compile(template);
    const html = templateParse(variables);

    try {
      const config = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      const transporter = nodemailer.createTransport(config);

      const info = await transporter.sendMail({
        from: `Online Quadros <${process.env.SMTP_EMAIL}>`, // sender address
        to: email,
        subject,
        html,
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return info;
    } catch (err) {
      console.log(err);
      console.log('erro ao enviar email');
    }
  }
}
