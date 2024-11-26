import { Body, Controller, Get, Post, Req, UseGuards, Version } from '@nestjs/common';
import { LocalGuard } from '../core/guards/local.guard';
import { Request } from 'express';
 
@Controller('login')
export class AuthController {

    @Post()
    @UseGuards(LocalGuard)
    @Version(['2'])
    login(@Req() req:Request){
        return req.user
    }

}
