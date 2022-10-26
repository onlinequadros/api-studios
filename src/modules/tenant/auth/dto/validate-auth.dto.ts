export class ValidateAuthDto {
  id: string;
  name: string;
  lastname: string;
  cpf: string;
  email: string;
  phone: string;
  sex: string;
  avatar?: string;
  birth_date: string;
  role: string;
  permissions: string[];
  is_active: boolean;
  user_type: string;
  slug?: string;
  created_at: Date;
}
