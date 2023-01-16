import { hash } from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyRepository } from './repositories/companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { validationCPF } from '../../utils/validationsCPF';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { randomInt } from 'crypto';
import { resolve } from 'path';
import { MailsService } from '../mails/mail.service';
import { validationCNPJ } from '../../utils/validationsCNPJ';
import { Client } from 'src/modules/tenant/clients/entities/client.entity';
import { TenantProvider } from '../../tenant/tenant.provider';
import { Repository } from 'typeorm';
import { TenantService } from 'src/modules/tenant/tenant.service';
import { BucketS3Service } from 'src/bucket-s3/bucket-s3.service';

@Injectable()
export class CompaniesService {
  private clientRepository: Repository<Client>;

  getClientRepository() {
    if (TenantProvider.connection) {
      this.clientRepository = TenantProvider.connection.getRepository(Client);
    }
  }

  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly mailsService: MailsService,
    private readonly clientService: TenantService,
    private readonly s3Service: BucketS3Service,
  ) {
    this.getClientRepository();
  }

  async validateCompany(createCompanyDto: CreateCompanyDto) {
    const emailExist = await this.companyRepository.findByEmail(
      createCompanyDto.email,
    );
    if (emailExist) throw new BadRequestException('O e-mail já está em uso.');

    const validCPF = validationCPF(createCompanyDto.cpf);
    if (!validCPF) throw new BadRequestException('CPF inválido.');

    const cpfExist = await this.companyRepository.findByCPF(
      createCompanyDto.cpf,
    );
    if (cpfExist) throw new BadRequestException('CPF já está em uso.');

    if (createCompanyDto.cnpj.length > 0) {
      const cnpjExists = await this.companyRepository.findByCNPJ(
        createCompanyDto.cnpj,
      );
      if (cnpjExists) throw new BadRequestException('CNPJ já em uso');

      const validCnpj = validationCNPJ(createCompanyDto.cnpj);
      if (!validCnpj) throw new BadRequestException('CNPJ inválido');
    }

    const verifyTenant = await this.companyRepository.findTenant(
      createCompanyDto.tenant_company,
    );

    if (verifyTenant) {
      throw new BadRequestException('Escolha outro nome para a url!');
    }
  }

  // FUNÇÃO PARA CRIAR UM USUÁRIO NO SISTEMA
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      await this.validateCompany(createCompanyDto);
      createCompanyDto.password = await hash(createCompanyDto.password, 8);

      const variables = {
        code: String(randomInt(10000, 99999)),
      };

      createCompanyDto.validate_access = false;
      createCompanyDto.code_access = variables.code;
      createCompanyDto.tenant_company = createCompanyDto.tenant_company
        .replace(/\s+/g, '')
        .toLowerCase();

      // CHAMADA PARA CRIAÇÃO DE UMA RÉPLICA DO USUÁRIO MASTER
      const createCompany = await this.companyRepository.create(
        createCompanyDto,
      );

      //SALVA OS DADOS DO USUÁRIO TAMBÉM EM CLIENTS NO TENANT
      await this.clientService.createTenant(
        createCompany.tenant_company,
        createCompany,
      );

      //CRIA O FOLDER DO TENANT NO AWS BUCKET S3
      await this.s3Service.createCompanyFolder(createCompany.tenant_company);

      delete createCompany.password;

      const templatePath = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'views',
        'emails',
        'confirmation-email.hbs',
      );

      await this.mailsService.sendEmail(
        createCompanyDto.email,
        'confirmação-cadastro Online Quadros',
        variables,
        templatePath,
      );

      return createCompany;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // FUNÇÃO PARA BUSCAR UM USUÁRIO POR ID
  async findOne(id: string) {
    const company = await this.companyRepository.findOne(id);

    if (!company) throw new BadRequestException('Companhina não encontrada.');

    delete company.password;

    return company;
  }

  // FUNÇÃO PARA BUSCAR UM TENANT VÁLIDO
  async findTenantCompany(name: string) {
    const company = await this.companyRepository.findComplement(name);

    if (!company)
      throw new BadRequestException('Não conectado ao banco de dados.');

    delete company.password;

    return company;
  }

  // FUNÇÃO PARA BUSCAR SE EXISTE UM NOME DE COMPLEMENTO CADASTRADO
  async findComplementCompany(name: string) {
    const company = await this.companyRepository.findTenant(name);

    if (company)
      throw new BadRequestException({
        statusCode: 400,
        message: 'Nome de complemento já existe!',
        available: false,
      });

    return { available: true };
  }

  // FUNÇÃO PARA BUSCAR UM USUÁRIO POR E-MAIL
  async findByEmail(email: string) {
    return await this.companyRepository.findByEmail(email);
  }

  // FUNÇÃO PARA VALIDAR E VERIFICAR UM E-MAIL
  async availableEmail(email: string) {
    const company = await this.companyRepository.findByEmail(email);
    if (company)
      throw new BadRequestException({
        statusCode: 400,
        message: 'E-mail já em uso.',
        available: false,
      });

    return { available: true };
  }

  // FUNÇÃO PARA VALIDAR E VERIFICAR UM CPF NO SISTEMA
  async availableCpf(cpf: string) {
    const validCPF = validationCPF(cpf);

    if (!validCPF)
      throw new BadRequestException({
        statusCode: 400,
        message: 'CPF inválido',
        available: false,
      });

    const company = await this.companyRepository.findByCPF(cpf);

    if (company)
      throw new BadRequestException({
        statusCode: 400,
        message: 'CPF já em uso.',
        available: false,
      });

    return { available: true };
  }

  // FUNÇÃO PARA VALIDAR E VERIFICAR UM CNPJ NO SISTEMA
  async availableCnpj(cnpj: string) {
    const validCNPJ = validationCNPJ(cnpj);

    if (!validCNPJ)
      throw new BadRequestException({
        statusCode: 400,
        message: 'CNPJ inválido',
        available: false,
      });

    const company = await this.companyRepository.findByCNPJ(cnpj);

    if (company)
      throw new BadRequestException({
        statusCode: 400,
        message: 'CNPJ já em uso.',
        available: false,
      });

    return { available: true };
  }

  // FUNÇÃO PARA ATUALIZAR UM USUÁRIO NO SISTEMA
  async update(company_id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.companyRepository.findOne(company_id);

      if (!company) throw new BadRequestException('Usuario não encontrado.');

      if (updateCompanyDto.cpf !== company.cpf) {
        const cpfExists = await this.companyRepository.findByCPF(
          updateCompanyDto.cpf,
        );

        if (cpfExists) throw new BadRequestException('CPF já está em uso.');
      }

      if (updateCompanyDto.email !== company.email) {
        const emailExists = await this.companyRepository.findByEmail(
          updateCompanyDto.email,
        );

        if (emailExists)
          throw new BadRequestException('E-mail já está um uso.');
      }

      Object.assign(company, updateCompanyDto);

      const updatedCompany = await this.companyRepository.create(company);

      delete updatedCompany.password;

      return updatedCompany;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // FUNÇÃO PARA PEGAR TODOS OS USUÁRIOS
  async getAllCompanies() {
    const company = await this.companyRepository.find();
    return company.map((companies) => {
      delete companies.password;
      return companies;
    });
  }

  // FUNÇÃO PARA PEGAR TODOS OS ESTÚDIOS
  async getAllStudios() {
    const company = await this.companyRepository.findStudio();
    return company.map((companies) => {
      delete companies.password;
      return companies;
    });
  }

  // FUNÇÃO PARA PEGAR UM USUÁRIO POR ID
  async getCompany(company_id: string) {
    const company = await this.companyRepository.findOne(company_id);
    if (!company) throw new BadRequestException('Companhia não encontrada.');

    delete company.password;
    return company;
  }

  // FUNÇÃO PARA REMOVER UM USUÁRIO POR ID
  async remove(company_id: string) {
    const del = await this.companyRepository.delete(company_id);
    return del;
  }

  // FUNÇÃO PARA VERIRICAR O CÓDIGO DE ACESSO NO REGISTRO
  async findCodeAccess(code_access: string) {
    const codeExists = await this.companyRepository.findOneCodeAccess(
      code_access,
    );
    if (!codeExists) throw new BadRequestException('Código não é válido.');
    return codeExists;
  }

  // FUNÇÃO PARA VALIDAR UM CÓDIGO EXISTENTE
  async validateCodeAccess(code_access: string) {
    const codeExists = await this.companyRepository.findOneCodeAccess(
      code_access,
    );

    if (!codeExists)
      throw new BadRequestException({
        statusCode: 400,
        message: 'Código inválido',
        available: false,
      });

    return { available: true };
  }

  // FUNÇÃO PARA CONFIRMAR O E-MAIL E ATUALIZAR A CONTA DO USUÁRIO
  async updateAccessAccountCodeEmail(code_access: string) {
    const codeExists = await this.companyRepository.findOneCodeAccess(
      code_access,
    );
    if (!codeExists) throw new BadRequestException('Falha ao validar conta.');

    codeExists.validate_access = true;
    const updateAccount = await this.companyRepository.create(codeExists);

    if (updateAccount) {
      return { validation: true, studio: codeExists.tenant_company };
    }
    return false;
  }
}
