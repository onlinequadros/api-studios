export class ValidateAuthDto {
  id: string;
  name: string;
  lastname: string;
  cpf: string;
  email: string;
  phone: string;
  sex: string;
  birth_date: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  user_type: string;
  created_at: Date;
}
