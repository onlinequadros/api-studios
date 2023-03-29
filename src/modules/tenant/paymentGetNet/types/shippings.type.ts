import { IsNotEmpty, IsString } from 'class-validator';

export class ShippingsAddressType {
  @IsString()
  @IsNotEmpty()
  street: string;
  number: string;
  city: string;
  state: string;
  postal_code: string;
}

export class ShippingsType {
  @IsString()
  @IsNotEmpty()
  address: ShippingsAddressType;
}
