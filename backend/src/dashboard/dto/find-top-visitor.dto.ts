import { IsOptional } from "class-validator"

export class FindTopVisitorDto {
    @IsOptional()
    department:string
    @IsOptional()
    program:string
    @IsOptional()
    year:number
    @IsOptional()
    date:string
    @IsOptional()
    month:number
}