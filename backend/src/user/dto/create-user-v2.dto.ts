import { IsJSON, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/config/role.enum';

export class CreateUserV2Dto {

  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  middleName: string=null;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  schoolId: string;
  @IsNotEmpty()
  department: string;
  @IsNotEmpty()
  program: string;

  @IsNotEmpty()
  encoding: number[];
}