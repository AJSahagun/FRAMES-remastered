import { IsDate, IsISO8601, IsNotEmpty } from "class-validator"

export class CreateHistoryDto {
    @IsNotEmpty()
    school_id:string
    @IsNotEmpty()
    
    @IsISO8601()
    time_in:Date
    @IsISO8601()
    time_out:Date

    @IsNotEmpty()
    encoding: number[];
}
