import { ArrayMaxSize, ArrayMinSize, IsArray, IsJSON, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Role } from '../../core/config/role.enum';

export class CreateUserV2Dto {

  @IsOptional()
  suffix: string;

  @IsNotEmpty()
  first_name: string;
  @IsOptional()
  middle_name: string;
  @IsNotEmpty()
  last_name: string;
  @IsNotEmpty()
  school_id: string;

  @IsOptional()
  department: string;
  @IsOptional()
  program: string;

  @IsArray()
  @ArrayMinSize(128)
  @ArrayMaxSize(128)
  @IsNumber({}, { each: true })
  encoding: number[];
}