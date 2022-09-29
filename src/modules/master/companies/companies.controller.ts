// import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Get,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
@ApiTags('Companys')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  // CRIA UM NOVO USUÁRIO
  @Post()
  @ApiOperation({ summary: 'Criar uma companhia no sistema.' })
  async create(@Body(new ValidationPipe()) companyDTO: CreateCompanyDto) {
    return await this.companyService.create(companyDTO);
  }

  // ATUALIZA PELO ID DO USUÁRIO INFORMADO
  @Put(':company_id')
  @ApiOperation({ summary: 'Alterar uma companhia no sistema.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('company_id') company_id: string,
    @Body(new ValidationPipe()) updateUserDTO: UpdateCompanyDto,
  ) {
    return await this.companyService.update(company_id, updateUserDTO);
  }

  // PEGA A LISTAGEM DE TODOS OS USUÁRIOS
  @Get()
  @ApiOperation({ summary: 'Buscar todos as companhias no sistema.' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async allCompanies() {
    return await this.companyService.getAllCompanies();
  }

  // FAZ A PESQUISA PELO ID DO USUÁRIO
  @Get(':company_id')
  @ApiOperation({ summary: 'Buscar uma companhia no sistema.' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async company(@Param('company_id') company_id: string) {
    return await this.companyService.getCompany(company_id);
  }

  // FAZ A PESQUISA E VERIRIFICA SE O CPF É VÁLIDO OU SE JÁ ESTÁ CADASTRADO
  @Get('/validation-cpf/:cpf')
  @ApiOperation({
    summary: 'Verificar um cpf válido ou cadastrado no sistema.',
  })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async verifyCpf(@Param('cpf') cpf: string) {
    return await this.companyService.availableCpf(cpf);
  }

  // VERIFICA SE JÁ EXISTE UM NOME DE COMPLEMENTO
  @Get('/verify-complement/:complement')
  @ApiOperation({
    summary: 'Verifica se já existe um complemento.',
  })
  @ApiBearerAuth()
  async verifyComplement(@Param('complement') complement: string) {
    return await this.companyService.findComplementCompany(complement);
  }

  // FAZ A PESQUISA E VERIRIFICA SE O CNPJ É VÁLIDO OU SE JÁ ESTÁ CADASTRADO
  @Get('/validation-cnpj/:cnpj')
  @ApiOperation({
    summary: 'Verificar um cnpj válido ou cadastrado no sistema.',
  })
  @ApiBearerAuth()
  async verifyCnpj(@Param('cnpj') cnpj: string) {
    return await this.companyService.availableCnpj(cnpj);
  }

  // FAZ A PESQUISA E VERIRIFICA SE O EMAIL É VÁLIDO OU SE JÁ ESTÁ CADASTRADO
  @Get('/validation-email/:email')
  @ApiOperation({ summary: 'Verificar um email cadastrado no sistema.' })
  @ApiBearerAuth()
  async verifyEmail(@Param('email') email: string) {
    return await this.companyService.availableEmail(email);
  }

  // FAZ A PESQUISA E VERIRIFICA SE O CÓDIGO É VÁLIDO NO REGISTRO
  @Get('/validation-email-code/:code')
  @ApiOperation({
    summary: 'Verificar o código de confirmação de e-mail válido no sistema.',
  })
  @ApiBearerAuth()
  async verifyEmailCode(@Param('code') code_access: string) {
    return await this.companyService.findCodeAccess(code_access);
  }

  // FAZ A VALIDAÇÃO DO CÓDIGO E ATUALIZAÇÃO DO CADASTRO DE COMPANHIAS
  @Patch('/access-validation/:code')
  @ApiOperation({
    summary: 'Atualiza o estado da validação do código no final do cadastro.',
  })
  @ApiBearerAuth()
  async updateAccessUserCode(@Param('code') code_access: string) {
    return await this.companyService.updateAccessAccountCodeEmail(code_access);
  }

  // VERIFICA O CÓDIGO PASSADO E RETORNA TRUE OU FALSE
  @Get('/access-validation-code/:code')
  @ApiOperation({
    summary: 'Retorna a verificação se o código existe ou não.',
  })
  @ApiBearerAuth()
  async validateAccessUserCode(@Param('code') code: string) {
    return await this.companyService.validateCodeAccess(code);
  }

  // DELETA UM USUÁRIO PELO ID INFORMADO
  @Delete(':company_id')
  @ApiOperation({ summary: 'Deletar uma companhia no sistema.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Param('company_id') company_id: string) {
    return await this.companyService.remove(company_id);
  }
}
