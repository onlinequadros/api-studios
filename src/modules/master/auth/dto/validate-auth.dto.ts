export class ValidateAuthDto {
  id: string;
  name: string;
  lastname: string;
  cpf: string;
  email: string;
  phone: string;
  sex: string;
  birth_date: string;
  cnpj?: string;
  company_name?: string;
  address: string;
  number: string;
  district: string;
  city: string;
  uf: string;
  cep: string;
  complement: string;
  segment: string;
  login_notification: boolean;
  validate_access?: boolean;
  created_at: Date;
  tenant_company: string;
  role: string;
}
