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

  @IsString()
  @IsIn(['Masculino', 'Feminino'])
  @ApiProperty({ default: 'Masculino' })
  sex: 'Masculino' | 'Feminino';

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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'Complemento' })
  complement: string;

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

  validate_access?: boolean;
  code_access?: string;
  status?: string;
  plan_recurrence?: string;
  plan_id?: string;
  is_active?: string;
  deleted_at?: Date;
}
