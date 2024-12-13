import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateAccountDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password:string

    @IsNotEmpty()
    role:string
}