import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreditCardPaymentType {
  @IsString()
  @IsNotEmpty()
  number: String;

  @IsString()
  @IsNotEmpty()
  expMonth: String;

  @IsString()
  @IsNotEmpty()
  expYear: String;

  @IsString()
  @IsNotEmpty()
  securityCode: String;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  installments: 1;
}
