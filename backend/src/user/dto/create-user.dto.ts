import { IsJSON, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/core/config/role.enum';

export class CreateUserDto {

  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  srCode: string;

  @IsOptional()
  middleName: string;
  @IsOptional()
  suffix: string;
  @IsOptional()
  department: string;
  @IsOptional()
  program: string;

  // @IsJSON()
  @IsNotEmpty()
  encoding: number[];
}
