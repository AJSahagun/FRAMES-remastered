import { IsNotEmpty, IsOptional } from 'class-validator';

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
