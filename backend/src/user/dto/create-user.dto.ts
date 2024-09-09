import { IsJSON, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/config/role.enum';

export class CreateUserDto {

  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  middleName: string=null;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  srCode: string;
  @IsNotEmpty()
  department: string;
  @IsNotEmpty()
  program: string;

  // @IsJSON()
  @IsNotEmpty()
  encoding: number[];
}
