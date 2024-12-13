import { IsOptional } from "class-validator"

export class FindHistoryDTO {
    @IsOptional()
    school_id:string
    @IsOptional()
    name: string
    @IsOptional()
    department: string
    @IsOptional()
    program: string
    @IsOptional()
    month:string
    @IsOptional()
    date:string
    @IsOptional()
    year:string
    @IsOptional()
    limit: number
    @IsOptional()
    offset: number
}