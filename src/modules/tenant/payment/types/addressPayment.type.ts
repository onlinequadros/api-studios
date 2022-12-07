import { IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';

export class AddressPaymentType {
  @IsString()
  @IsNotEmpty()
  street: String;
  number: String;
  complement: String;
  locality: String;
  city: String;
  regionCode: String;
  country: String;

  @IsNotEmpty()
  @Matches(/[0-9]{5}[0-9]{3}/)
  postalCode: String;
}
