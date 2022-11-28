import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CheckObject {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  check: boolean;
  order: boolean;
}
