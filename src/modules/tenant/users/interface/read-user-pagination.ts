import { ReadUserDto } from '../dto/read-user.dto';

export interface IResponseUserData {
  count: number;
  totalPages: number;
  data: ReadUserDto[];
}
