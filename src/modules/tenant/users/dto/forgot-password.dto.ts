import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ForgotPassword {
  @IsString()
  @IsOptional()
  @Expose()
  readonly password?: string;

  @IsOptional()
  @Expose()
  readonly forgot_password?: string;
}
