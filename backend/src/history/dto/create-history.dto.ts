import { IsDate, IsISO8601, IsNotEmpty } from "class-validator"

export class CreateHistoryDto {
    @IsNotEmpty()
    schoolId:string
    @IsNotEmpty()
    
    @IsISO8601()
    timeIn:Date
    @IsISO8601()
    timeOut:Date

    // @IsNotEmpty()
    // encoding: number[];
}
