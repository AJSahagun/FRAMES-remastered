import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards, Version } from '@nestjs/common';
import { LocalGuard } from '../core/guards/local.guard';
import { Request } from 'express';
import { CreateAccountDto } from './dto/create.account.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from 'src/core/guards/jwt.guard';
import { Roles } from 'src/core/decorators/roles/roles.decorator';
import { Role } from 'src/core/config/role.enum';
import { UpdateAccountDto } from './dto/update.account.dto';
 
@Controller('auth')
@UseGuards(JwtGuard)
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

    
    @Roles(Role.Dev, Role.Admin)
    @Get('accounts')
    getAccounts(){
        try {
            return this.authService.getAccounts()
        } catch (error) {
            return error
        }
    }

    @Roles(Role.Dev, Role.Admin)
    @Post('accounts')
    create(@Body() createUserDto: CreateAccountDto){
        try {
            return this.authService.createAccount(createUserDto)
        } catch (error) {
            return error
        }
    }

    @Roles(Role.Dev, Role.Admin)
    @Patch('accounts/:username')
    async update(@Param('username') username:string, @Body() update:UpdateAccountDto){
        const account = await this.authService.find(username)
        if(account.length<=0) throw new NotFoundException("Username doesn't exists")
        try {

            return this.authService.update(username, update)
        } catch (error) {
            return error
        }
    }
    @Roles(Role.Dev, Role.Admin)
    @Delete('accounts/:username')
    delete(@Param('username') username:string){
        try {
            const account=this.authService.find(username)
            if(username.length<0) return new NotFoundException("Username doesn't exists")

            return this.authService.delete(username)
        } catch (error) {
            return error
        }
    }


}
