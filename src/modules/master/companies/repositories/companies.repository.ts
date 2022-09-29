import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const user = this.repository.create(createCompanyDto);

    await this.repository.save(user);

    return user;
  }

  async find(): Promise<Company[]> {
    return await this.repository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Company> {
    return await this.repository.findOne({ where: { id } });
  }

  async findTenant(name: string): Promise<Company> {
    return await this.repository.findOne({ where: { tenant_company: name } });
  }

  async findComplement(name: string): Promise<Company> {
    return await this.repository.findOne({ where: { tenant_company: name } });
  }

  async findByEmail(email: string): Promise<Company> {
    return await this.repository.findOne({ where: { email } });
  }

  async findByCNPJ(cnpj: string): Promise<Company> {
    return await this.repository.findOne({ where: { cnpj } });
  }

  async findByCPF(cpf: string): Promise<Company> {
    return await this.repository.findOne({ where: { cpf } });
  }

  async delete(company_id: string) {
    return await this.repository.delete({ id: company_id });
  }

  async findOneCodeAccess(code_access: string) {
    return await this.repository.findOne({ where: { code_access } });
  }
}
