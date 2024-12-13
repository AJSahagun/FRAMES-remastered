import { IsOptional } from "class-validator";

export class CreateConfigurationDto {
    @IsOptional()
    tos: string
    @IsOptional()
    max_occupants: number

}
