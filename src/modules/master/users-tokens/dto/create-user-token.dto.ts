export class CreateUserTokenDto {
  expires_date: Date;
  refresh_token: string;
  user_id: string;
}
