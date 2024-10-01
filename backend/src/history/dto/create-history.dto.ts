import { IsDate, IsISO8601, IsNotEmpty } from "class-validator"

export class CreateHistoryDto {
    @IsNotEmpty()
    srCode:string
    @IsNotEmpty()
    
    @IsISO8601()
    timeIn:Date
    @IsISO8601()
    timeOut:Date
}
