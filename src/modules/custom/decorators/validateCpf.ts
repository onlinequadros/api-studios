import {
    ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidateCpf', async: true })
export class ValidateCpf implements ValidatorConstraintInterface {
  validate(cpf: string) {
    let sum;
    let rest;
    let i;
    sum = 0;
    if (cpf == '00000000000') return false;

    for (i = 1; i <= 9; i++)
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;

    if (rest == 10 || rest == 11) rest = 0;
    if (rest != parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (i = 1; i <= 10; i++)
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;

    if (rest == 10 || rest == 11) rest = 0;
    if (rest != parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  defaultMessage(): string {
      return 'Cpf Inválido, favor verifique e tente novamente!';
  }
}
