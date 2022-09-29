import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { UsersTokensRepository } from '../users-tokens/repositories/users-tokens.repository';
import { CompanyRepository } from '../companies/repositories/companies.repository';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly companiesTokenRepository: UsersTokensRepository,
  ) {}

  async reset({ token, password }) {
    const companyToken = await this.companiesTokenRepository.findByRefreshToken(
      token,
    );

    if (!companyToken)
      throw new UnauthorizedException('Código token invalido!');

    if (dayjs(companyToken.expires_date).isBefore(dayjs().toDate()))
      throw new BadRequestException('Código token expirado!');

    const company = await this.companyRepository.findOne(companyToken.user_id);

    company.password = await hash(password, 8);

    await this.companyRepository.create(company);

    await this.companiesTokenRepository.deleteById(companyToken.id);
  }

  async changePassword(
    old_password: string,
    new_password: string,
    company_id: string,
  ) {
    const company = await this.companyRepository.findOne(company_id);

    if (await compare(old_password, company.password)) {
      company.password = await hash(new_password, 8);

      await this.companyRepository.create(company);
    } else {
      throw new BadRequestException('Senha antiga incorreta!');
    }
  }

  // async adminChangePasswordProfiles(new_password: string, user_id: string) {
  //   const user = await this.usersRepository.findOne(user_id);
  //   user.password = await hash(new_password, 8);

  //   await this.usersRepository.create(user);
  // }
}
