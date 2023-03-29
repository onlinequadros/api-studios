import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerPaymentType {
  @IsString()
  @IsNotEmpty()
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  document_type: string;
  document_number: string;
  phone_number: string;
  billing_address: CustomerAddressPaymentType;
}

export class CustomerAddressPaymentType {
  @IsString()
  @IsNotEmpty()
  street: string;
  number: string;
  city: string;
  state: string;
  postal_code: string;
}
