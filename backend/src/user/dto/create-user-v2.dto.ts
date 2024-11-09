import { IsJSON, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/core/config/role.enum';

export class CreateUserV2Dto {

  @IsNotEmpty()
  first_name: string;

  @IsOptional()
  middle_name: string=null;
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty()
  school_id: string;
  @IsNotEmpty()
  department: string;
  @IsNotEmpty()
  program: string;

  @IsNotEmpty()
  encoding: number[];
}