import { Inject, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto } from './dto/create.account.dto';
import { errorCatch } from 'src/core/config/errors';

@Injectable()
export class AuthService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private jwtService:JwtService
    ){}

    async validateUser(authPayload: AuthPayloadDto){
        const username=authPayload.username
        const pwd=authPayload.password

        const query= `SELECT * FROM accounts WHERE username = $1`;
        const users = await this.sql(query,[username]);

        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt.compare(pwd, user.password);
            if(!isMatch) return { error:{code:404}}
            const {password, uuid, ...woPAss}=user
            
            
            return {token:this.jwtService.sign(woPAss), role:user.role}
        }
        return { error: {code:404}}
    }

    async createAccount(createAccount:CreateAccountDto){
        try {
            const {username, password, role}=createAccount

            const hashed = await bcrypt.hash(password, 12)
            const account=await this.sql(`insert into accounts("username", "password", "role") values($1,$2, $3)`,[username, hashed, role])
            return account
        } catch (error) {
            errorCatch(error)
        }
    }
    async getAccounts(){
        try {
            const account=await this.sql(`select username,role,date_created from accounts`)
            return account
        } catch (error) {
            errorCatch(error)
        }
    }
}
