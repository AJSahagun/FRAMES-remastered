import { Body, Controller, Get, Post, Req, UseGuards, Version } from '@nestjs/common';
import { LocalGuard } from '../core/guards/local.guard';
import { Request } from 'express';
import { CreateAccountDto } from './dto/create.account.dto';
import { AuthService } from './auth.service';
 
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    @UseGuards(LocalGuard)
    @Version(['2'])
    login(@Req() req:Request){
        return req.user
    }

    @Post('create')
    createAccount(@Body() createUserDto: CreateAccountDto){
        try {
            return this.authService.createAccount(createUserDto)
        } catch (error) {
            return error
        }
    }

    @Get('accounts')
    getAccounts(){
        try {
            return this.authService.getAccounts()
        } catch (error) {
            return error
        }
    }

}
