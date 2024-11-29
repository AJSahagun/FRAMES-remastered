import { IsIn, IsOptional } from "class-validator"

export class QueryDto {
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

    @IsOptional()
    limit:number
    @IsOptional()
    offset:number
}