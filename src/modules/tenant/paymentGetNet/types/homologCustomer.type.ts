import { IsNotEmpty, IsString } from 'class-validator';

export class HomologCustomerPaymentType {
  @IsString()
  @IsNotEmpty()
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  document_type: string;
  document_number: string;
  phone_number: string;
  billing_address: HomologCustomerAddressPaymentType;
}

export class HomologCustomerAddressPaymentType {
  @IsString()
  @IsNotEmpty()
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
}
