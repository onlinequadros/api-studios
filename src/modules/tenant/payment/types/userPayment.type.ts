import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserPaymentType {
  @IsString()
  @IsNotEmpty()
  name: String;

  @IsEmail()
  @IsNotEmpty()
  email: String;

  @Matches(
    /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
  )
  cpf_or_cpnj: String;
}
