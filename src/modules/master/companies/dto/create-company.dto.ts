import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
  Length,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do usuário' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Sobrenome do usuário' })
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @ApiProperty({ default: '12345678910' })
  cpf: string;

  @IsEmail()
  @ApiProperty({ default: 'email@fasters.com.br' })
  email: string;

  @IsPhoneNumber('BR')
  @ApiProperty({ default: '11999999999' })
  phone: string;

  @IsOptional()
  @IsIn(['Masculino', 'Feminino'])
  @ApiProperty({ default: 'Masculino', required: false })
  sex?: 'Masculino' | 'Feminino';

  @IsDateString()
  @ApiProperty({ default: '1990-01-01' })
  birth_date: string;

  @IsOptional()
  @ApiProperty({ default: '99999999999999' })
  cnpj?: string;

  @IsOptional()
  @ApiProperty({ default: 'Nome da empresa ou fantasia' })
  company_name?: string;

  @IsOptional()
  @ApiProperty({ default: 'Mensagem para direcionamento ou envio de e-mail' })
  message_email?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Nome do endereço' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Número do endereço' })
  number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Bairro' })
  district: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Cidade' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Estado' })
  uf: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'CEP do endereço' })
  cep: string;

  @IsOptional()
  @ApiProperty({ default: 'Complemento' })
  complement?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Admin', 'Studio'])
  @ApiProperty({ default: 'Segmento' })
  segment: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'nome company tenant' })
  tenant_company: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Admin', 'Studio', 'Fotografo', 'Artista'])
  @ApiProperty({ default: 'Nível de acesso e permissão' })
  role: 'Admin' | 'Studio' | 'Fotografo' | 'Artista';

  @IsString()
  @MinLength(6)
  @ApiProperty({ default: '123456' })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: 'true' })
  login_notification: boolean;

  @IsOptional()
  @IsIn(['CORRENTE', 'POUPANCA'])
  @ApiProperty({ default: 'Tipo da conta bancária' })
  type_account_bank?: 'CORRENTE' | 'POUPANCA';

  @IsOptional()
  @ApiProperty({ default: 'Nome do banco' })
  name_bank?: string;

  @IsOptional()
  @ApiProperty({ default: 'Agencia do banco' })
  agency_bank?: string;

  @IsOptional()
  @ApiProperty({ default: 'Dígito da Agencia' })
  digit_agency_bank?: string;

  @IsOptional()
  @ApiProperty({ default: 'Conta do banco' })
  account_bank?: string;

  @IsOptional()
  @ApiProperty({ default: 'Dígito conta do banco' })
  digit_account_bank?: string;

  @IsOptional()
  @ApiProperty({ default: 'Conta PIX' })
  account_pix_bank?: string;

  validate_access?: boolean;
  code_access?: string;
  status?: string;
  plan_recurrence?: string;
  plan_id?: string;
  is_active?: string;

  deleted_at?: Date;
}
